from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from flask_cors import CORS  

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("ice.csv")

# Extract features and target variable
X = np.array(df["Temperature"]).reshape(-1, 1)
y = np.array(df["Sales"])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)

# Train the model
regressor = LinearRegression()
regressor.fit(X_train, y_train)

# Model accuracy
y_pred_test = regressor.predict(X_test).. 
r2 = r2_score(y_test, y_pred_test)

# ✅ Add a homepage route to avoid 404 error
@app.route("/")
def home():
    return "Welcome to the Ice Cream Sales Predictor API! Use /predict to get predictions."

# Prediction API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        temperature = float(data["temperature"])
        predicted_sales = regressor.predict(np.array([[temperature]]))[0]

        return jsonify({
            "predicted_sales": round(predicted_sales, 2),
            "r2_score": round(r2, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
