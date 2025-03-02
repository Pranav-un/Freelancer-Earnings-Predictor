from flask import Flask, request, jsonify, render_template
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("freelancer_earnings_data.csv")

# Simple Linear Regression Model
X_slr = np.array(df["hours_worked"]).reshape(-1, 1)
y_slr = np.array(df["earnings"])

# Train-test split for SLR
X_slr_train, X_slr_test, y_slr_train, y_slr_test = train_test_split(
    X_slr, y_slr, test_size=0.3, random_state=42
)

# Train the SLR model
slr_model = LinearRegression()
slr_model.fit(X_slr_train, y_slr_train)

# Calculate SLR accuracy
y_slr_pred_test = slr_model.predict(X_slr_test)
slr_r2 = r2_score(y_slr_test, y_slr_pred_test)

# Multiple Linear Regression Model
X_mlr = df[["hours_worked", "num_clients", "skill_level", "rating"]]
y_mlr = df["earnings"]

# Train-test split for MLR
X_mlr_train, X_mlr_test, y_mlr_train, y_mlr_test = train_test_split(
    X_mlr, y_mlr, test_size=0.3, random_state=42
)

# Train the MLR model
mlr_model = LinearRegression()
mlr_model.fit(X_mlr_train, y_mlr_train)

# Calculate MLR accuracy
y_mlr_pred_test = mlr_model.predict(X_mlr_test)
mlr_r2 = r2_score(y_mlr_test, y_mlr_pred_test)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/predict/slr", methods=["POST"])
def predict_slr():
    try:
        data = request.json
        hours_worked = float(data["hours_worked"])
        predicted_earnings = slr_model.predict(np.array([[hours_worked]]))[0]

        return jsonify({
            "prediction": round(predicted_earnings, 2),
            "r2_score": round(slr_r2, 4),
            "input": {"hours_worked": hours_worked}
        })
    except Exception as e:
        return jsonify({"error": str(e)})

@app.route("/api/predict/mlr", methods=["POST"])
def predict_mlr():
    try:
        data = request.json
        hours_worked = float(data["hours_worked"])
        num_clients = float(data["num_clients"])
        skill_level = float(data["skill_level"])
        rating = float(data["rating"])
        
        features = np.array([[hours_worked, num_clients, skill_level, rating]])
        predicted_earnings = mlr_model.predict(features)[0]

        return jsonify({
            "prediction": round(predicted_earnings, 2),
            "r2_score": round(mlr_r2, 4),
            "input": {
                "hours_worked": hours_worked,
                "num_clients": num_clients,
                "skill_level": skill_level,
                "rating": rating
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)