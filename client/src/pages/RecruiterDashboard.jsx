import React from "react";
import SalaryCharts from "../components/recruiter/SalaryCharts";
// import ExperienceTrendsChart from "../components/recruiter/ExperienceTrendsChart"; // ✅ new
import SalaryPredictor from "../components/developer/SalaryPredictor"; // ← relative path
import AnalyticsDashboard from "../components/common/AnalyticsDashboard";
const RecruiterDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Recruiter Dashboard</h2>
      <p>Explore salary trends and insights</p>
      <SalaryCharts />
       <AnalyticsDashboard />
      <SalaryPredictor />
    </div>
  );
};

export default RecruiterDashboard;
