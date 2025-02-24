// Function to send temperature to backend and get prediction
function predictSales() {
  let temperatureInput = document.getElementById("temperature");
  let temperature = temperatureInput.value.trim();

  // Validate input
  if (temperature === "" || isNaN(temperature)) {
    alert("⚠️ Please enter a valid temperature!");
    return;
  }

  temperature = parseFloat(temperature);

  if (temperature < 0 || temperature > 50) {
    alert("⚠️ Temperature must be between 0°C and 50°C!");
    return;
  }

  // Disable input & button while loading
  temperatureInput.disabled = true;
  let predictBtn = document.getElementById("predict-btn");
  predictBtn.innerHTML = "⏳ Predicting...";
  predictBtn.disabled = true;

  // Define API URL dynamically (change this if deployed)
  const API_URL =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
      ? "http://127.0.0.1:5000/predict"
      : "https://your-deployed-api.com/predict"; // Change to your actual deployed API URL

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ temperature: temperature }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Server responded with an error!");
      }
      return response.json();
    })
    .then((data) => {
      // Update UI with results and keep emojis
      document.getElementById(
        "result"
      ).innerHTML = `🍦 <b>Predicted Sales:</b> ${data.predicted_sales} units`;

      document.getElementById(
        "accuracy"
      ).innerHTML = `📊 <b>Model Accuracy (R² Score):</b> ${data.r2_score}`;

      // Restore button text and re-enable input
      predictBtn.innerHTML = "🔮 Predict Sales";
      predictBtn.disabled = false;
      temperatureInput.disabled = false;
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("❌ An error occurred while predicting sales. Please try again.");

      // Restore button text and re-enable input on error
      predictBtn.innerHTML = "🔮 Predict Sales";
      predictBtn.disabled = false;
      temperatureInput.disabled = false;
    });
}

// Add event listener for button click
document.getElementById("predict-btn").addEventListener("click", predictSales);
