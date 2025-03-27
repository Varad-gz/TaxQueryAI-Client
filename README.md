# TaxQuery AI

TaxQuery AI is a Gen AI-powered property tax Q&A tool designed to help users query and analyze property tax data from seven cities in India. The project utilizes a MySQL database, AI-powered chatbot, and data analytics to provide insights and future predictions.

## Features

- **Q&A System**: Ask questions about property tax data (2013–2018) from Pune, Solapur, Chennai, Erode, Jabalpur, Thanjavur, and Tiruchirappalli.
  
- **24/7 Chatbot**: AI-powered chatbot to assist with tax-related queries.
- **Analytics Dashboard**: Provides visual insights using cleaned datasets.
- **Prediction Visualization**: Forecasts future tax trends and displays visual representations.
- **Data Cleaning Pipeline**: Utilizes Azure services (Data Factory, Databricks, Data Lake) for data preprocessing.

## Tech Stack

### Backend
- **Python** (Flask, Streamlit, LangChain)
  
- **MySQL** (Database for storing property tax data)
- **LangChain** (For AI-driven question answering)

### Frontend
- **Next.js** (React-based UI for interaction)

### Data Processing
- **Azure Data Factory** (ETL pipeline)
  
- **Azure Databricks** (Data transformation)
- **Azure Data Lake** (Storage for raw and cleaned data)

## Prerequisites
- Python 3.x
- Node.js and npm
- MySQL Server
- Azure account (for data processing)

## Deployment

TaxQuery AI is deployed on **Vercel** for seamless frontend hosting and efficient performance.

You can access the live application here: **[TaxQueryAI](https://taxqueryai.vercel.app/)**

## Usage

- Access the chatbot via the UI to ask property tax-related questions.
  
- View analytical insights and predictions on the dashboard.
- Query the database directly using natural language.
