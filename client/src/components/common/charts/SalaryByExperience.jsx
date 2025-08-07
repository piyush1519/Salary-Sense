// src/components/common/charts/SalaryByExperience.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalaryByExperience = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/trends/experience")
      .then(res => setData(res.data.data))
      .catch(err => console.error("Experience error", err));
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">Average Salary by Experience</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="avgSalary" stroke="#10B981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryByExperience;
