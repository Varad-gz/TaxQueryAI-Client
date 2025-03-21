from flask import Flask, request, jsonify
from flask_cors import CORS
from logic import extract_query_info, generate_sql_query, give_breakdown, get_response, chatbot_response
from langchain_community.utilities import SQLDatabase
from dotenv import load_dotenv
import os
import pandas as pd

app = Flask(__name__)
CORS(app)  # allows Next.js frontend to access this API

load_dotenv()  # load the environment variables
mysql_uri = os.getenv("MYSQL_URI")

db = None  # initialize the database connection once

def get_db():
    """Ensure the database connection is initialized only once."""
    global db
    if db is None:
        db = SQLDatabase.from_uri(mysql_uri)
    return db

@app.route('/')
def home():
    return jsonify({"message": "Welcome to TaxQueryAI API"})

@app.route('/api/get_response', methods=['POST'])
def api_get_response():
    data = request.json
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"response": "Please enter a valid question."})


    c, ptype, y = extract_query_info(user_query)  # extract query info
    df = None  # load the dataset
    if c:
        df_path = f"https://raw.githubusercontent.com/pratyush770/TaxQueryAI/master/datasets/transformed_data/Property-Tax-{c}.csv"
        df = pd.read_csv(df_path)  # load CSV from GitHub
    ai_response, year, metric = get_response(user_query, get_db(), c, ptype, y, df)
    return jsonify({"year": year, "response": ai_response, metric: metric})


@app.route('/api/get_sql_query', methods=['POST'])
def generate_sql():
    try:
        data = request.json
        user_query = data.get("query", "")
        last_response = data.get("last_response", "")

        if not user_query:
            return jsonify({"response": "Please enter a valid question."}), 400

        # check if last AI response contains "predicted"
        if "predicted" in last_response.lower():
            return jsonify({"sql_query": "The previous response involved a Machine Learning prediction, thus no SQL query was generated."})

        sql_query = generate_sql_query(get_db(), user_query)

        return jsonify({"sql_query": sql_query})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/get_breakdown', methods=['POST'])
def api_get_breakdown():
    try:
        data = request.json
        user_query = data.get("query", "")
        last_response = data.get("last_response", "")

        if not user_query:
            return jsonify({"response": "Please enter a valid question."}), 400
        if not last_response:
            return jsonify({"response": "No previous response found. Please ask a valid query first."}), 400

        is_prediction = "predicted" in last_response.lower()  # check if it's a future prediction
        breakdown = give_breakdown(user_query, last_response, get_db(), is_prediction)  # get breakdown

        return jsonify({"breakdown": breakdown})  # return breakdown

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/get_ai_response', methods=['POST'])
def api_get_ai_response():
    data = request.json
    user_query = data.get("query", "")

    if not user_query:
        return jsonify({"response": "Please enter a valid question."})

    ai_response = chatbot_response(user_query)
    return jsonify({"response": ai_response})


if __name__ == '__main__':
    db = get_db()  # initialize the database when the app starts
    # app.run(port=3000, debug=True)
