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

model_name1 = "meta-llama/llama-4-scout-17b-16e-instruct"  # name of model used
llm = ChatGroq(
    model_name=model_name1,
    temperature=0.1,  # more accurate results
    groq_api_key=sec_key
)

model_name = "allam-2-7b"  # name of model used
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


def get_sql_chain(db: SQLDatabase, user_query: str):  # function to get sql query 
    c, ptype, y = extract_query_info(user_query)
    group_column = "Ward_Name" if c in ['Pune', 'Solapur'] else "Ward_No"
    if ("total" in user_query.lower() or "all" in user_query.lower()) and \
        ("tax demand" in user_query.lower() or "tax collection" in user_query.lower()):
        template = """
            Based on the table schema below, write only a SQL query that would answer the user's question.
            Don't provide any extra information other than the sql query.
            {schema}

            Rule:
            - If the question contains the words "total" or "all," group the results by `{group_column}`.

            For example:
            Question: "What was the total tax collection in 2013-14 residential in Pune city?"
            SQL Query: SELECT Ward_Name, SUM(Tax_Collection_Cr_2013_14_Residential) AS total_tax_collected FROM pune GROUP BY Ward_Name;
            Question: "What was the total tax demand in 2015-16 commercial in Solapur city?"
            SQL Query: SELECT Ward_Name, SUM(Tax_Collection_Cr_2015_16_Commercial) AS total_tax_demand FROM solapur GROUP BY Ward_Name;
            Question: "What was the total tax demand in 2015-16 commercial in Thanjavur city?"
            SQL Query: SELECT Ward_No, SUM(Tax_Demand_Cr_2015_16_Commercial) AS total_tax_demand FROM thanjavur GROUP BY Ward_No;
            Question: "What was the total tax demand for the year 2015-16 residential for Jabalpur?"
            SQL Query: SELECT Ward_No, SUM(Tax_Demand_Cr_2015_16_Residential) AS total_tax_demand FROM jabalpur GROUP BY Ward_No;

            Your turn:
            Question: {question}
            SQL Query:
        """
    else:
        template = """
        Based on the table schema below, write only a SQL query that would answer the user's question.
        Don't provide any extra information other than the sql query.
        {schema}

        For example:
        Question: "How many rows are there in the pune table?"
        SQL Query: SELECT COUNT(Ward_Name) AS ward_count FROM pune;
        Question: What was the tax demand in 2015-16 commercial for bhavani in solapur city?
        SQL Query: SELECT SUM(Tax_Demand_Cr_2015_16_Commercial) AS total_tax_demand FROM solapur WHERE Ward_Name = "Bhavani";
        Question: What was the property efficiency for the year 2015-16 commercial for Chennai?
        SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2015_16_Commercial) / SUM(Tax_Demand_Cr_2015_16_Commercial)) * 100, 2) AS property_efficiency_percent FROM chennai;
        Question: What was the property efficiency for pune from 2013-18 commercial?
        SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2013_14_Commercial) + SUM(Tax_Collection_Cr_2014_15_Commercial) + SUM(Tax_Collection_Cr_2015_16_Commercial) + SUM(Tax_Collection_Cr_2016_17_Commercial) + SUM(Tax_Collection_Cr_2017_18_Commercial)) / (SUM(Tax_Demand_Cr_2013_14_Commercial) + SUM(Tax_Demand_Cr_2014_15_Commercial) + SUM(Tax_Demand_Cr_2015_16_Commercial) + SUM(Tax_Demand_Cr_2016_17_Commercial) + SUM(Tax_Demand_Cr_2017_18_Commercial)) * 100, 2) AS property_efficiency_percent FROM pune;
        Question: What was the collection gap for the year 2016-17 residential for Jabalpur?
        SQL Query: SELECT ROUND(SUM(Tax_Demand_Cr_2016_17_Residential) - SUM(Tax_Collection_Cr_2016_17_Residential), 2) AS collection_gap FROM jabalpur;
        Question: What was the collection gap for Tiruchirappalli from 2013-18 residential?
        SQL Query: SELECT ROUND((SUM(Tax_Demand_Cr_2013_14_Residential) + SUM(Tax_Demand_Cr_2014_15_Residential) + SUM(Tax_Demand_Cr_2015_16_Residential) + SUM(Tax_Demand_Cr_2016_17_Residential) + SUM(Tax_Demand_Cr_2017_18_Residential)) - (SUM(Tax_Collection_Cr_2013_14_Residential) + SUM(Tax_Collection_Cr_2014_15_Residential) + SUM(Tax_Collection_Cr_2015_16_Residential) + SUM(Tax_Collection_Cr_2016_17_Residential) + SUM(Tax_Collection_Cr_2017_18_Residential)), 2) AS collection_gap FROM tiruchirappalli;

        Your turn:
        Question: {question}
        SQL Query:
    """
    prompt = ChatPromptTemplate.from_template(template)
    return (
            RunnablePassthrough.assign(schema=lambda _: get_schema(db), group_column=lambda _: group_column)  # use cached schema
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
            return f"The predicted property efficiency for {city} {property_type} in {year} is {efficiency}%", efficiency
        elif "gap" in user_query.lower():  # check for collection gap query
            gap = round((prediction['predicted_demand'] - prediction['predicted_collection']), 2)
            return f"The predicted collection gap for {city} {property_type} in {year} is {gap} Cr", gap
        elif "demand" in user_query.lower():  # check for tax demand query
            demand = round(prediction['predicted_demand'],2)
            return f"The predicted tax demand for {city} {property_type} in {year} is {demand} Cr", demand
        elif "collection" in user_query.lower():  # check for tax demand query
            collection = round(prediction['predicted_collection'], 2)
            return f"The predicted tax collection for {city} {property_type} in {year} is {collection} Cr", collection
        else:
            return "Please specify whether you want the tax collection or demand prediction."
    return None, None


def get_sql_response(user_query: str, db: SQLDatabase):
    sql_chain = get_sql_chain(db, user_query)  # sql chain for other queries
    total = None
    if "total" in user_query.lower() or "all" in user_query.lower():
        detailed_breakdown = get_response_groupby(user_query, db)
        total = detailed_breakdown.get("Total", None)
        template = """
        Convert the SQL response into a natural language response.
        {schema}

        Question: {question}
        SQL Query: {query}
        SQL Response: {response}
        Total: {total}
        Natural Language Response: Generate a response using the total value ({total} crore) and the context of the question.
        """
    else:
        template = """
        Convert the SQL response into a natural language response.
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
        "question": user_query,
        "total": total 
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
    sql_query = get_sql_chain(db, user_query).invoke({"question": user_query})  # get SQL query
    city, property_type, selected_year = extract_query_info(user_query)  # extract city, property type, and year from the query

    if is_prediction:  # for future prediction
        template = """
            Provide a structured breakdown of how the prediction was generated. Ensure the explanation is structured in past tense without explicitly mentioning it.

            **Question:** {question}  
            **Response:** {response} 

            **Breakdown:**      
            • **Historical data range:** Property tax data from **2013 to 2018** was used for training.  
            • The year **{selected_year}** was selected for prediction.  
            • A **Linear Regression** model was trained on this dataset to identify patterns.  
            • The trained model analyzed past trends and generated the predicted property tax value.  
            • The prediction was based on observed trends and could vary due to unforeseen factors.  
        """
    else:  # for existing data
        template = """
            Provide a structured breakdown of how the response was derived from the database. Ensure the explanation is structured in past tense without explicitly mentioning it.

            **Question:** {question}  
            **Response:** {response}

            **Breakdown:**  
            • **Historical data range:** Property tax data from **2013 to 2018** was used.  
            • The year **{selected_year}** was selected for this query.  
            • Relevant tables and fields were identified.  
            • Necessary filters (e.g., city, property type, year) were applied.  
            • The following SQL query was executed: `{sql_query}`  
            • Database records were retrieved and processed to compute the required values.  
            • The response was formatted accordingly.  
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
        "selected_year": selected_year if selected_year else "N/A"
    })


def generate_sql_query(db, question):
    return get_sql_chain(db, question).invoke({"question": question})


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
        return "unknown"  # default if no known type is found
    

def get_response_groupby(user_query: str, db: SQLDatabase):
    if "total" in user_query.lower() or "all" in user_query.lower():
        sql_query = get_sql_chain(db, user_query).invoke({"question": user_query})
        detailed_data = pd.read_sql(sql_query, db._engine)
        ward_column = "Ward_Name" if "Ward_Name" in sql_query else "Ward_No"
        if ward_column in detailed_data.columns:  # ensure the ward column is treated as a string
            detailed_data[ward_column] = detailed_data[ward_column].astype(str)
        match = re.search(r'SELECT\s+.*\s+AS\s+(\w+)', sql_query, re.IGNORECASE)
        value_column = match.group(1) if match else None
        if ward_column and value_column:
            detailed_breakdown = {
                row[ward_column]: row[value_column] for _, row in detailed_data.iterrows()
            }
            total_value = sum(detailed_breakdown.values())  # compute the total value
            detailed_breakdown["Total"] = total_value  # add the total to the breakdown dictionary
            return detailed_breakdown
    return None


def get_response(user_query: str, db: SQLDatabase, city: str, property_type: str, year: int, df: pd.DataFrame):
    metric_type = extract_metric_type(user_query)  # extract metric type
    value = None  # initialize a variable to store the computed/predicted value
    # check for a prediction-based response
    prediction_response, v = get_prediction_response(user_query, city, property_type, year, df)
    value = v
    if prediction_response:
        return prediction_response, year, metric_type, value  # if there's a prediction, return it immediately
    # handle collection gap queries
    if "collection gap" in user_query.lower() and year > 2018:
        gap = predict_metric(user_query, city, year, property_type, df)
        value = gap  # store the gap value
        return f"The predicted collection gap for {city} {property_type} in {year} is {gap} Cr", year, metric_type, value
    # handle property efficiency queries
    if "property efficiency" in user_query.lower() and year > 2018:
        efficiency = predict_metric(user_query, city, year, property_type, df)
        value = efficiency  # store the efficiency value
        return f"The predicted property efficiency for {city} {property_type} in {year} is {efficiency}%", year, metric_type, value
    # if no predictions applied, execute a normal SQL query
    sql_response = get_sql_response(user_query, db)  # get response
    numeric_value = re.search(r'(\d+\.\d+)', sql_response)
    if numeric_value:
        value = float(numeric_value.group())  # convert extracted value to float
    return sql_response, year, metric_type, value  


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
    mysql_uri = mysql_uri
    db = SQLDatabase.from_uri(mysql_uri)
    df = pd.read_csv("https://raw.githubusercontent.com/pratyush770/TaxQueryAI/master/datasets/transformed_data/Property-Tax-Tiruchirappalli.csv")  # load tax data

    # example: normal query
    user_query = "What was the total tax demand for the year 2016-17 commercial for Tiruchirappalli?"
    city = "Tiruchirappalli"
    property_type = "Commercial"
    year = 2016
    sql_query = get_sql_chain(db, user_query).invoke({"question": user_query})  # get sql query
    print(sql_query)
    response = get_response(user_query, db, city, property_type, year, df)  # get natural language response
    print(response)
    detailed_breakdown = get_response_groupby(user_query, db)
    print(detailed_breakdown)

    # example: user requests breakdown
    user_query_breakdown = "Give me the breakdown"
    is_prediction = False
    breakdown = give_breakdown(user_query, response, db, is_prediction)
    print(breakdown)