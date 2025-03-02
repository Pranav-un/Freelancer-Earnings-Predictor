document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const modelToggle = document.getElementById("model-toggle-input");
  const slrLabel = document.getElementById("slr-label");
  const mlrLabel = document.getElementById("mlr-label");
  const slrForm = document.getElementById("slr-form");
  const mlrForm = document.getElementById("mlr-form");
  const slrPredictBtn = document.getElementById("slr-predict-btn");
  const mlrPredictBtn = document.getElementById("mlr-predict-btn");
  const predictionAmount = document.getElementById("prediction-amount");
  const predictionDetails = document.getElementById("prediction-details");
  const modelAccuracy = document.getElementById("model-accuracy");
  const modelExplanation = document.getElementById("model-explanation");
  const skillValue = document.getElementById("skill-value");
  const ratingValue = document.getElementById("rating-value");
  const skillInput = document.getElementById("mlr-skill");
  const ratingInput = document.getElementById("mlr-rating");

  // Toggle between SLR and MLR models
  modelToggle.addEventListener("change", function () {
    if (this.checked) {
      // Switch to MLR
      slrLabel.classList.remove("active");
      mlrLabel.classList.add("active");
      slrForm.classList.remove("active");
      mlrForm.classList.add("active");
      modelExplanation.textContent =
        "This prediction considers multiple factors including hours worked, number of clients, skill level, and client ratings.";
    } else {
      // Switch to SLR
      mlrLabel.classList.remove("active");
      slrLabel.classList.add("active");
      mlrForm.classList.remove("active");
      slrForm.classList.add("active");
      modelExplanation.textContent =
        "This prediction is based on the relationship between hours worked and typical freelancer earnings.";
    }

    // Reset prediction display
    predictionAmount.textContent = "$0.00";
    predictionDetails.textContent = "";
    modelAccuracy.textContent = "";
  });

  // Update range slider values
  skillInput.addEventListener("input", function () {
    skillValue.textContent = this.value;
  });

  ratingInput.addEventListener("input", function () {
    ratingValue.textContent = this.value;
  });

  // Handle SLR prediction
  slrPredictBtn.addEventListener("click", async function () {
    // Show loading state
    predictionAmount.textContent = "Calculating...";
    predictionDetails.textContent = "";
    modelAccuracy.textContent = "";

    const hoursWorked = document.getElementById("slr-hours").value;

    try {
      const response = await fetch("/api/predict/slr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hours_worked: hoursWorked }),
      });

      const data = await response.json();

      if (data.error) {
        predictionAmount.textContent = "Error";
        predictionDetails.textContent = data.error;
        return;
      }

      // Format and display the prediction
      const formattedPrediction = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(data.prediction);

      predictionAmount.textContent = formattedPrediction;
      predictionDetails.textContent = `Based on ${hoursWorked} hours worked per week`;
      modelAccuracy.textContent = `Model accuracy (R² score): ${data.r2_score}`;
    } catch (error) {
      predictionAmount.textContent = "Error";
      predictionDetails.textContent =
        "Failed to get prediction. Please try again.";
      console.error("Error:", error);
    }
  });

  // Handle MLR prediction
  mlrPredictBtn.addEventListener("click", async function () {
    // Show loading state
    predictionAmount.textContent = "Calculating...";
    predictionDetails.textContent = "";
    modelAccuracy.textContent = "";

    const hoursWorked = document.getElementById("mlr-hours").value;
    const numClients = document.getElementById("mlr-clients").value;
    const skillLevel = document.getElementById("mlr-skill").value;
    const rating = document.getElementById("mlr-rating").value;

    try {
      const response = await fetch("/api/predict/mlr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hours_worked: hoursWorked,
          num_clients: numClients,
          skill_level: skillLevel,
          rating: rating,
        }),
      });

      const data = await response.json();

      if (data.error) {
        predictionAmount.textContent = "Error";
        predictionDetails.textContent = data.error;
        return;
      }

      // Format and display the prediction
      const formattedPrediction = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(data.prediction);

      predictionAmount.textContent = formattedPrediction;
      predictionDetails.textContent = `Based on ${hoursWorked} hours worked, ${numClients} clients, skill level of ${skillLevel}, and rating of ${rating}`;
      modelAccuracy.textContent = `Model accuracy (R² score): ${data.r2_score}`;
    } catch (error) {
      predictionAmount.textContent = "Error";
      predictionDetails.textContent =
        "Failed to get prediction. Please try again.";
      console.error("Error:", error);
    }
  });
});
