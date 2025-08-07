// src/components/common/charts/SalaryByWorkMode.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#F59E0B", "#EF4444"];

const SalaryByWorkMode = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/trends/workmode")
      .then(res => setData(res.data.data))
      .catch(err => console.error("WorkMode error", err));
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">Average Salary by Work Mode</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="avgSalary"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryByWorkMode;
