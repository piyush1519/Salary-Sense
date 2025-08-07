// src/components/common/charts/SalaryByEducation.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalaryByEducation = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/trends/education")
      .then(res => setData(res.data.data))
      .catch(err => console.error("Education error", err));
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">Average Salary by Education Level</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgSalary" fill="#EC4899" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryByEducation;
