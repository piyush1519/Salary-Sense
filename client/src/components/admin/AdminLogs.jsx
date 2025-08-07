import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/logs");
        if (res.data.success) setLogs(res.data.data.reverse());
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>🧾 Activity Logs</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            <strong>{new Date(log.timestamp).toLocaleString()}</strong> - {log.action} — {log.detail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminLogs;
