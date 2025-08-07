import React, { useState } from "react";
import axios from "axios";
import AnalyticsDashboard from "../components/common/AnalyticsDashboard";
import AdminLogs from "../components/admin/AdminLogs";
const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [retrainMessage, setRetrainMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/admin/upload", formData);
      setUploadMessage(res.data.message);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/admin/retrain");
      setRetrainMessage(res.data.message);
    } catch (err) {
      console.error("Retrain error:", err);
      setRetrainMessage("Retrain failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>👨‍💼 Admin Dashboard</h2>

      <div style={{ marginTop: "30px" }}>
        <h4>📁 Upload Dataset (.csv)</h4>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h4>🔁 Retrain Model</h4>
        <button onClick={handleRetrain} disabled={loading}>
          {loading ? "Retraining..." : "Retrain Model"}
        </button>
        {retrainMessage && <p>{retrainMessage}</p>}
      </div>
      <AnalyticsDashboard />
      {/* ✅ Include the admin logs component */}
      <AdminLogs />
    </div>
  );
};

export default AdminDashboard;
