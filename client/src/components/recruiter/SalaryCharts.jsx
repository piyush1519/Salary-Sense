import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Chart configuration for each endpoint and chart
const chartConfigs = [
  { label: "Salary by Organization Size", endpoint: "org-size", dataKey: "label" },
  { label: "Salary by Experience (Years)", endpoint: "experience", dataKey: "label" },
  { label: "Remote vs On-site", endpoint: "workmode", dataKey: "label" },
  { label: "Salary by Education", endpoint: "education", dataKey: "label" },
  { label: "Salary by Region", endpoint: "region", dataKey: "label" },
];

const SalaryCharts = () => {
  const [chartsData, setChartsData] = useState({});

  useEffect(() => {
    chartConfigs.forEach(async (config) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trends/${config.endpoint}`);
        if (res.data.success) {
          setChartsData((prev) => ({ ...prev, [config.endpoint]: res.data.data }));
        }
      } catch (err) {
        console.error(`❌ Failed to fetch ${config.endpoint}:`, err.message);
      }
    });
  }, []);

  const renderChart = ({ label, endpoint, dataKey }) => {
    const data = chartsData[endpoint];
    if (!data || data.length === 0) return null;

    return (
      <div key={endpoint} className="mb-10">
        <h3 className="text-xl font-semibold mb-2">{label}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKey} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="avgSalary" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Salary Insights</h2>
      {chartConfigs.map(renderChart)}
    </div>
  );
};

export default SalaryCharts;
