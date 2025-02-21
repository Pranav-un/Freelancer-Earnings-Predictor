import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Sample dataset (Temperature vs. Ice Cream Sales)
data = {
    "Temperature": [20, 25, 30, 35, 40, 45, 50],
    "Sales": [100, 150, 200, 250, 300, 350, 400]
}
df = pd.DataFrame(data)

# Calculate coefficients for simple linear regression
X = np.array(df["Temperature"])
y = np.array(df["Sales"])
m, b = np.polyfit(X, y, 1)  # Linear regression fit

def predict_sales(temp):
    return m * temp + b

# Run prediction for a sample input
temp_input = 30
predicted_sales = predict_sales(temp_input)
print(f"Predicted sales for {temp_input}°C: {predicted_sales:.2f}")

# Plot the data and regression line
plt.scatter(X, y, color='blue', label='Actual Data')
plt.plot(X, m * X + b, color='red', label='Regression Line')
plt.xlabel('Temperature (°C)')
plt.ylabel('Sales')
plt.legend()
plt.show()
