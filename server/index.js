// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const clerkMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
connectDB();
app.use(clerkMiddleware);

// Routes
app.use("/api/predict", require("./routes/predict"));
 app.use("/admin/upload", require("./routes/upload"));
app.use("/admin/retrain", require("./routes/retrain"));
app.use("/api/trends", require("./routes/trends"));
app.use("/admin/logs", require("./routes/logs"));
// app.use("/api/report", require("./routes/report"));
app.get("/", (req, res) => {
  res.send("🚀 Salary-Sense API running.");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
