// src/components/common/charts/SalaryByOrgSize.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SalaryByOrgSize = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/trends/org-size")
      .then(res => setData(res.data.data))
      .catch(err => console.error("OrgSize error", err));
  }, []);

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">Average Salary by Organization Size</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgSalary" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryByOrgSize;
