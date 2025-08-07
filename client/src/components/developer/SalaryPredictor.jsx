import React, { useState } from "react";
import axios from "axios";

const SalaryPredictor = () => {
  const [formData, setFormData] = useState({
    YearsCodePro: "",
    OrgSize: "",
    WorkExp: "",
    NumberOfDatabasesKnown: "",
    NumberOfPlatformsKnown: "",
    Remote: false,
    Developer: true,
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      YearsCodePro: Number(formData.YearsCodePro),
      OrgSize: formData.OrgSize,
      WorkExp: Number(formData.WorkExp),
      NumberOfDatabasesKnown: Number(formData.NumberOfDatabasesKnown),
      NumberOfPlatformsKnown: Number(formData.NumberOfPlatformsKnown),
      Remote: Boolean(formData.Remote),
      Developer: Boolean(formData.Developer),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/predict", payload);
      setPrediction(response.data.predictedSalary);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>💼 Developer Salary Predictor</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="YearsCodePro"
          placeholder="Years of Professional Coding"
          type="number"
          value={formData.YearsCodePro}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="OrgSize"
          placeholder="Organization Size (e.g. 100-500)"
          value={formData.OrgSize}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="WorkExp"
          placeholder="Work Experience (Years)"
          type="number"
          value={formData.WorkExp}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="NumberOfDatabasesKnown"
          placeholder="Databases Known"
          type="number"
          value={formData.NumberOfDatabasesKnown}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="NumberOfPlatformsKnown"
          placeholder="Platforms Known"
          type="number"
          value={formData.NumberOfPlatformsKnown}
          onChange={handleChange}
          required
        /><br /><br />

        <label>
          <input
            type="checkbox"
            name="Remote"
            checked={formData.Remote}
            onChange={handleChange}
          />{" "}
          Remote Job
        </label><br /><br />

        <label>
          <input
            type="checkbox"
            name="Developer"
            checked={formData.Developer}
            onChange={handleChange}
          />{" "}
          Is Developer
        </label><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Salary"}
        </button>
      </form>

      {prediction !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>💰 Predicted Salary: ${prediction.toLocaleString()}</h3>
        </div>
      )}
    </div>
  );
};

export default SalaryPredictor;
