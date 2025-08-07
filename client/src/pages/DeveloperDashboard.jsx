// import React, { useState } from "react";
// import axios from "axios";

// const DeveloperForm = () => {
//   const [formData, setFormData] = useState({
//     skills: "",
//     experience: "",
//     jobRole: "",
//     location: "",
//   });

//   const [prediction, setPrediction] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:5000/api/predict", {
//         ...formData,
//         experience: Number(formData.experience), // ensure number type
//       });

//       setPrediction(response.data.predictedSalary);
//     } catch (error) {
//       console.error("Prediction error:", error);
//       alert("Prediction failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "auto" }}>
//       <h2>Developer Salary Predictor</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           name="skills"
//           placeholder="Skills (e.g., React, Node)"
//           value={formData.skills}
//           onChange={handleChange}
//           required
//         /><br /><br />
//         <input
//           name="experience"
//           placeholder="Years of Experience"
//           type="number"
//           value={formData.experience}
//           onChange={handleChange}
//           required
//         /><br /><br />
//         <input
//           name="jobRole"
//           placeholder="Job Role"
//           value={formData.jobRole}
//           onChange={handleChange}
//           required
//         /><br /><br />
//         <input
//           name="location"
//           placeholder="Location"
//           value={formData.location}
//           onChange={handleChange}
//           required
//         /><br /><br />
//         <button type="submit" disabled={loading}>
//           {loading ? "Predicting..." : "Predict Salary"}
//         </button>
//       </form>

//       {prediction && (
//         <div style={{ marginTop: "20px" }}>
//           <h3>Predicted Salary: ${prediction.toLocaleString()}</h3>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeveloperForm;
import React from "react";
import SalaryPredictor from "../components/developer/SalaryPredictor"; // ← relative path
import AnalyticsDashboard from "../components/common/AnalyticsDashboard";
const DeveloperDashboard = () => (
  <div style={{ padding: "20px" }}>
    <h2>👨‍💻 Developer Dashboard</h2>
    <p>Welcome, Developer!</p>

    <hr />
    <SalaryPredictor />
    <AnalyticsDashboard />
  </div>
);

export default DeveloperDashboard;
