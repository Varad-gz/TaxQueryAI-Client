from dotenv import load_dotenv
import os
import pandas as pd
from langchain_community.utilities import SQLDatabase
from langchain_core.output_parsers import StrOutputParser  # for parsing the output into a string
from langchain_core.runnables import RunnablePassthrough  # allows the function to pass as a runnable
from langchain_groq import ChatGroq
from prediction import train_prediction_model
from langchain_core.prompts import ChatPromptTemplate
import re

load_dotenv()  # load the environment variables
sec_key = os.getenv("GROQ_API_KEY")
mysql_uri = os.getenv("MYSQL_URI")

model_name1 = "qwen-2.5-32b"  # name of model used
llm = ChatGroq(
    model_name=model_name1,
    temperature=0.1,  # more accurate results
    groq_api_key=sec_key
)

model_name = "llama-3.2-1b-preview"  # name of model used
llm1 = ChatGroq(  # used only for breakdown function to optimize token usage
    model_name=model_name,
    temperature=0.1,  # more accurate results
    groq_api_key=sec_key
)

SCHEMA_CACHE = None  # global schema cache


def get_schema(db: SQLDatabase):
    global SCHEMA_CACHE
    if SCHEMA_CACHE is None:
        SCHEMA_CACHE = db.get_table_info()
    return SCHEMA_CACHE


def get_sql_chain(db: SQLDatabase):  # function to get sql query
    template = """
        Based on the table schema below, write only a SQL query that would answer the user's question.
        Don't provide any extra information other than the sql query.
        {schema}

        For example: 
        Question: "How many rows are there in the pune table?"
        SQL Query: SELECT COUNT(Ward_Name) AS ward_count FROM pune;
        Question: What was the total property tax collection in 2013-14 residential for aundh in pune city?
        SQL Query: SELECT SUM(Tax_Collection_Cr_2013_14_Residential) AS total_tax_collected FROM pune WHERE Ward_Name = "Aundh";
        Question: What was the property efficiency for the year 2015-16 commercial for Chennai?
        SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2015_16_Commercial) / SUM(Tax_Demand_Cr_2015_16_Commercial)) * 100, 2) AS property_efficiency_percent FROM chennai;
        Question: What was the property efficiency for pune from 2013-18 commercial?
        SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2013_14_Commercial) + SUM(Tax_Collection_Cr_2014_15_Commercial) + SUM(Tax_Collection_Cr_2015_16_Commercial) + SUM(Tax_Collection_Cr_2016_17_Commercial) + SUM(Tax_Collection_Cr_2017_18_Commercial)) / (SUM(Tax_Demand_Cr_2013_14_Commercial) + SUM(Tax_Demand_Cr_2014_15_Commercial) + SUM(Tax_Demand_Cr_2015_16_Commercial) + SUM(Tax_Demand_Cr_2016_17_Commercial) + SUM(Tax_Demand_Cr_2017_18_Commercial)) * 100, 2) AS property_efficiency_percent FROM pune;
        Question: What was the collection gap for the year 2016-17 residential for Thanjavur?
        SQL Query: SELECT ROUND(SUM(Tax_Demand_Cr_2016_17_Residential) - SUM(Tax_Collection_Cr_2016_17_Residential), 2) AS collection_gap_2016_17 FROM thanjavur;
        Question: What was the collection gap for solapur from 2013-18 residential?
        SQL Query: SELECT ROUND((SUM(Tax_Demand_Cr_2013_14_Residential) + SUM(Tax_Demand_Cr_2014_15_Residential) + SUM(Tax_Demand_Cr_2015_16_Residential) + SUM(Tax_Demand_Cr_2016_17_Residential) + SUM(Tax_Demand_Cr_2017_18_Residential)) - (SUM(Tax_Collection_Cr_2013_14_Residential) + SUM(Tax_Collection_Cr_2014_15_Residential) + SUM(Tax_Collection_Cr_2015_16_Residential) + SUM(Tax_Collection_Cr_2016_17_Residential) + SUM(Tax_Collection_Cr_2017_18_Residential)), 2) AS collection_gap FROM solapur;
        
        Your turn:
        Question: {question}
        SQL Query:
    """
    prompt = ChatPromptTemplate.from_template(template)
    return (
            RunnablePassthrough.assign(schema=lambda _: get_schema(db))  # use cached schema
            | prompt
            | llm.bind(stop=["\nSQLResult:"])
            | StrOutputParser()
    )


def get_prediction_response(user_query: str, city: str, property_type: str, year: int, df: pd.DataFrame):
    predict_tax = train_prediction_model(df, property_type)  # train the model for the given property type
    prediction = predict_tax(year) if year is not None and year >= 2019 else None  # get the prediction for the year
    # if prediction is available, return only the relevant prediction based on user query
    if prediction:
        if "efficiency" in user_query.lower():  # check for property efficiency query
            efficiency = round((prediction['predicted_collection'] / prediction['predicted_demand']) * 100, 2)
            return f"The predicted property efficiency for {city} {property_type} in {year} is {efficiency}%"
        elif "demand" in user_query.lower():
            return f"The predicted tax demand for {city} {property_type} in {year} is {prediction['predicted_demand']} Cr"
        elif "collection" in user_query.lower():
            return f"The predicted tax collection for {city} {property_type} in {year} is {prediction['predicted_collection']} Cr"
        else:
            return "Please specify whether you want the tax collection or demand prediction."
    return None


def get_sql_response(user_query: str, db: SQLDatabase):
    sql_chain = get_sql_chain(db)  # sql chain for other queries
    template = """
       Convert the SQL response into a natural language response:
       {schema}

       Question: {question}
       SQL Query: {query}
       SQL Response: {response}
       Natural Language Response (check if response is related to a property efficiency or counting entries, if neither, append " crore" at the end):
    """
    prompt = ChatPromptTemplate.from_template(template)  # template to get the natural language response

    chain = (
            RunnablePassthrough.assign(query=sql_chain).assign(
                schema=lambda _: get_schema(db),  # use cached schema
                response=lambda var: db.run(var["query"]),
            )
            | prompt
            | llm
            | StrOutputParser()
    )

    return chain.invoke({
        "question": user_query
    })


def predict_metric(user_query, city, year, property_type, df):  # for predicting collection gap / property efficiency
    predict_tax = train_prediction_model(df, property_type)  # train the prediction model for the given property type
    tax_demand = predict_tax(year)["predicted_demand"]  # get the prediction for tax demand
    tax_collection = predict_tax(year)["predicted_collection"]  # get the prediction for tax collection
    if "collection gap" in user_query.lower():  # for collection gap
        return round((tax_demand - tax_collection), 2)  # calculate the collection gap
    elif "property_efficiency" in user_query.lower():  # for property efficiency
        return round(((tax_collection / tax_demand) * 100), 2)  # calculate the property efficiency
    return None


def extract_query_info(user_query):  # function to extract city, property type, and year
    cities = ['Pune', 'Solapur', 'Erode', 'Jabalpur', 'Thanjavur', 'Chennai', 'Tiruchirappalli']
    property_types = ["Residential", "Commercial"]
    city = next((c for c in cities if c.lower() in user_query.lower()), None)
    property_type = next((p for p in property_types if p.lower() in user_query.lower()), "Residential")
    # use regular expression to find a year between 2013 and 2050
    year_match = re.search(r'\b(201[3-9]|20[2-4][0-9]|2050)\b', user_query)
    year = int(year_match.group()) if year_match else None
    return city, property_type, year


def give_breakdown(user_query: str, response: str, db: SQLDatabase, is_prediction: bool):
    sql_query = get_sql_chain(db).invoke({"question": user_query})  # get SQL query
    if is_prediction:  # for future prediction
        template = """
            Based on the user's question and the predicted response, provide a structured breakdown of how the prediction was generated.
            The explanation should be in past tense and concise.

            **Question:** {question}  
            **Response:** {response} 

            **Breakdown:**      
            • Historical property tax data from 2013 to 2018 was gathered.  
            • A **Linear Regression** model was trained on this data to identify patterns.  
            • The trained model predicted the property tax value for the requested year.  
            • The prediction is based on observed trends and may vary due to unforeseen factors.  
        """
    else:  # for existing data
        template = """
            Provide a structured breakdown of how the response was derived from the database.
            The explanation should be in past tense and concise.

            **Question:** {question}  
            **Response:** {response}

            **Breakdown:**  
            • Step 1: Identify relevant tables and fields.  
            • Step 2: Apply necessary filters (e.g., city, property type, year).  
            • Step 3: Display the sql query {sql_query}  
            • Step 4: Compute values using the database records.  
            • Step 5: Format the response accordingly.  
        """

    prompt = ChatPromptTemplate.from_template(template)

    chain = (
            RunnablePassthrough.assign(
                schema=lambda _: get_schema(db),  # get cached schema
            )
            | prompt
            | llm1
            | StrOutputParser()
    )

    return chain.invoke({
        "question": user_query,
        "response": response,
        "sql_query": sql_query,
    })



def generate_sql_query(db, question):
    return get_sql_chain(db).invoke({"question": question})


def extract_metric_type(user_query: str):
    user_query = user_query.lower()
    if "tax demand" in user_query:
        return "tax demand"
    elif "tax collection" in user_query:
        return "tax collection"
    elif "collection gap" in user_query:
        return "collection gap"
    elif "property efficiency" in user_query:
        return "property efficiency"
    else:
        return "unknown"  # Default if no known type is found
    
    
def get_response(user_query: str, db: SQLDatabase, city: str, property_type: str, year: int,
                 df: pd.DataFrame):
    metric_type = extract_metric_type(user_query)  # extract metric type
    # check for a prediction-based response
    prediction_response = get_prediction_response(user_query, city, property_type, year, df)
    if prediction_response:
        return prediction_response, year, metric_type  # if there's a prediction, return it immediately
    # handle collection gap queries
    if "collection gap" in user_query.lower() and year > 2018:
        gap = predict_metric(user_query, city, year, property_type, df)
        return f"The predicted collection gap for {city} {property_type} in {year} is {gap} Cr", year, metric_type
    # handle property efficiency queries
    if "property efficiency" in user_query.lower() and year > 2018:
        efficiency = predict_metric(user_query, city, year, property_type, df)
        return f"The predicted property efficiency for {city} {property_type} in {year} is {efficiency}%", year, metric_type
    # if no predictions applied, execute a normal SQL query
    sql_response = get_sql_response(user_query, db)
    return sql_response, year, metric_type  # return both response and year


def chatbot_response(user_query: str):  # function to return the chatbot_response
    template = """
    User: {user_query}
    AI: Provide the most relevant and concise answer.
    """
    template = ChatPromptTemplate.from_template(template)
    sequence = template | llm  
    response = sequence.invoke({"user_query": user_query})
    response_text = response.content.strip()  # removes extra whitespaces
    return response_text  # return only the content


if __name__ == "__main__":
    mysql_uri = mysql_uri  # use local database
    db = SQLDatabase.from_uri(mysql_uri)
    df = pd.read_csv("D:/TaxQueryAI/datasets/transformed_data/Property-Tax-Erode.csv")  # load tax data

    # example: normal query
    user_query = "What was the tax collection in 2013-14 residential for Erode in ward 3?"
    city = "Erode"
    property_type = "Residential"
    year = 2013
    sql_query = get_sql_chain(db).invoke({"question": user_query})  # get sql query
    print(sql_query)
    response = get_response(user_query, db, city, property_type, year, df)  # get natural language response
    print(response)

    # example: user requests breakdown
    user_query_breakdown = "Give me the breakdown"
    is_prediction = False
    breakdown = give_breakdown(user_query, response, db, is_prediction)
    print(breakdown)
