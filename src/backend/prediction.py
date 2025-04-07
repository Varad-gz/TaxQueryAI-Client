import numpy as np
from sklearn.linear_model import LinearRegression


def train_prediction_model(df, property_type):  # train and predict
    tax_sums = {  # adds all the rows
        "collection": df[[f'Tax_Collection_Cr_2013_14_{property_type}',
                          f'Tax_Collection_Cr_2014_15_{property_type}',
                          f'Tax_Collection_Cr_2015_16_{property_type}',
                          f'Tax_Collection_Cr_2016_17_{property_type}',
                          f'Tax_Collection_Cr_2017_18_{property_type}']].sum(axis=0),

        "demand": df[[f'Tax_Demand_Cr_2013_14_{property_type}',
                      f'Tax_Demand_Cr_2014_15_{property_type}',
                      f'Tax_Demand_Cr_2015_16_{property_type}',
                      f'Tax_Demand_Cr_2016_17_{property_type}',
                      f'Tax_Demand_Cr_2017_18_{property_type}']].sum(axis=0)
    }

    X = np.array([2014, 2015, 2016, 2017, 2018]).reshape(-1, 1)
    models = {}

    for key in ["collection", "demand"]:
        y = tax_sums[key].values
        model = LinearRegression()  # LinearRegression() call
        model.fit(X, y)  # fits the model
        models[key] = model

    def predict_tax(year):  # function to predict tax collection and demand
        if year is not None and year >= 2019:  # since we already have data from 2013-18
            return {
                "predicted_collection": float(models["collection"].predict([[year]])[0]),  # for tax collection prediction
                "predicted_demand": float(models["demand"].predict([[year]])[0])  # for tax demand prediction
            }
        return None

    return predict_tax


# Question: What was the tax demand in 2015-16 commercial for bhavani in solapur city?
# SQL Query: SELECT Tax_Demand_Cr_2015_16_Commercial AS total_tax_demand FROM solapur WHERE Ward_Name = "Bhavani";
# Question: What was the property efficiency for the year 2015-16 commercial for Chennai?
# SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2015_16_Commercial) / SUM(Tax_Demand_Cr_2015_16_Commercial)) * 100, 2) AS property_efficiency_percent FROM chennai;
# Question: What was the property efficiency for pune from 2013-18 commercial?
# SQL Query: SELECT ROUND((SUM(Tax_Collection_Cr_2013_14_Commercial) + SUM(Tax_Collection_Cr_2014_15_Commercial) + SUM(Tax_Collection_Cr_2015_16_Commercial) + SUM(Tax_Collection_Cr_2016_17_Commercial) + SUM(Tax_Collection_Cr_2017_18_Commercial)) / (SUM(Tax_Demand_Cr_2013_14_Commercial) + SUM(Tax_Demand_Cr_2014_15_Commercial) + SUM(Tax_Demand_Cr_2015_16_Commercial) + SUM(Tax_Demand_Cr_2016_17_Commercial) + SUM(Tax_Demand_Cr_2017_18_Commercial)) * 100, 2) AS property_efficiency_percent FROM pune;
# Question: What was the collection gap for the year 2016-17 residential for Thanjavur?
# SQL Query: SELECT ROUND(SUM(Tax_Demand_Cr_2016_17_Residential) - SUM(Tax_Collection_Cr_2016_17_Residential), 2) AS collection_gap_2016_17 FROM thanjavur;
# Question: What was the collection gap for solapur from 2013-18 residential?
# SQL Query: SELECT ROUND((SUM(Tax_Demand_Cr_2013_14_Residential) + SUM(Tax_Demand_Cr_2014_15_Residential) + SUM(Tax_Demand_Cr_2015_16_Residential) + SUM(Tax_Demand_Cr_2016_17_Residential) + SUM(Tax_Demand_Cr_2017_18_Residential)) - (SUM(Tax_Collection_Cr_2013_14_Residential) + SUM(Tax_Collection_Cr_2014_15_Residential) + SUM(Tax_Collection_Cr_2015_16_Residential) + SUM(Tax_Collection_Cr_2016_17_Residential) + SUM(Tax_Collection_Cr_2017_18_Residential)), 2) AS collection_gap FROM solapur;