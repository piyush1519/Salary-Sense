import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartConfigs = [
  { label: "📊 Salary by Organization Size", endpoint: "org-size" },
  { label: "📈 Salary by Experience", endpoint: "experience" },
  { label: "🏢 Salary by Work Mode", endpoint: "workmode" },
  { label: "🎓 Salary by Education Level", endpoint: "education" },
  { label: "🌍 Salary by Region", endpoint: "region" },
];

// inside AnalyticsDashboard.jsx (or your chosen dashboard)

// import axios from "axios";

const generatePDFReport = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/report/generate", {
      trendData: {
        "Salary by Region": [
          { label: "Asia", avgSalary: 50000 },
          { label: "Europe", avgSalary: 65000 }
        ],
        "Salary by Education": [
          { label: "Masters", avgSalary: 72000 },
          { label: "Bachelors", avgSalary: 60000 }
        ]
      },
      summaryText: "Europe leads in average salary.\nMasters degree gives highest boost."
    });

    if (response.data.success) {
      // PDF generated successfully — now trigger download
      window.open("http://localhost:5000/api/report/download", "_blank");
    } else {
      alert("Failed to generate report");
    }
  } catch (err) {
    console.error("Report generation failed:", err);
    alert("Error generating PDF report.");
  }
};
const downloadReport = async () => {
  try {
    const genRes = await axios.post("http://localhost:5000/api/report/generate");
    if (genRes.data.success) {
      const link = document.createElement("a");
      link.href = "http://localhost:5000/api/report/download";
      link.setAttribute("download", "salary-report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (err) {
    console.error("❌ Error generating or downloading report:", err);
    alert("Something went wrong.");
  }
};



const AnalyticsDashboard = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      for (const config of chartConfigs) {
        try {
          const res = await axios.get(`http://localhost:5000/api/trends/${config.endpoint}`);
          if (res.data.success) {
            setChartData((prev) => ({
              ...prev,
              [config.endpoint]: res.data.data,
            }));
          }
        } catch (err) {
          console.error(`❌ Failed to fetch ${config.endpoint}:`, err.message);
        }
      }
    };

    fetchData();
  }, []);

  const renderChart = (endpoint, title) => {
    const data = chartData[endpoint];
    if (!data || data.length === 0) return null;

    return (
      <div key={endpoint} className="mb-10 bg-white dark:bg-gray-800 shadow p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: "var(--x-color)" }} />
            <YAxis tick={{ fill: "var(--x-color)" }} />
            <Tooltip />
            <Bar dataKey="avgSalary" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <button onClick={downloadReport} className="btn btn-primary">
  📄 Generate PDF Report
</button>

      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">📊 Developer Salary Insights</h2>
      {chartConfigs.map((cfg) => renderChart(cfg.endpoint, cfg.label))}
    </div>
  );
};

export default AnalyticsDashboard;
