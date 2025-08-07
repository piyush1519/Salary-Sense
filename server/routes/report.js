const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const { spawn } = require("child_process");

const datasetPath = path.join(__dirname, "../../ml-etl/uploads/dataset.csv");
const reportPath = path.join(__dirname, "../../ml-etl/uploads/salary-report.pdf");

// Utility: Read CSV
const readCSV = (onRow, onEnd, onError) => {
  if (!fs.existsSync(datasetPath)) return onError("Dataset not found");
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on("data", onRow)
    .on("end", onEnd)
    .on("error", onError);
};

// Utility: Compute trends
const computeTrend = (field) => {
  const sums = {}, counts = {};
  return new Promise((resolve, reject) => {
    readCSV(
      (row) => {
        const label = row[field];
        const salary = parseFloat(row["Salary"]);
        if (!isNaN(salary) && label) {
          sums[label] = (sums[label] || 0) + salary;
          counts[label] = (counts[label] || 0) + 1;
        }
      },
      () => {
        const result = Object.keys(sums).map((label) => ({
          label,
          avgSalary: parseFloat((sums[label] / counts[label]).toFixed(2)),
        }));
        resolve(result);
      },
      (err) => reject(err)
    );
  });
};

// Utility: Generate Summary
const generateSummary = (trendData) => {
  const highlights = [];
  for (const [category, data] of Object.entries(trendData)) {
    if (data.length > 0) {
      const highest = data.reduce((a, b) => (a.avgSalary > b.avgSalary ? a : b));
      highlights.push(
        `📌 In "${category}", "${highest.label}" has the highest average salary: $${highest.avgSalary}`
      );
    }
  }
  return highlights.join("\n");
};

// 🔧 POST /api/report/generate
router.post("/generate", async (req, res) => {
  try {
    const trendData = {
      "Average Salary by Org Size": await computeTrend("OrgSize"),
      "Average Salary by Region": await computeTrend("Region"),
      "Average Salary by Work Mode": await computeTrend("WorkLocation"),
      "Average Salary by Education": await computeTrend("EdLevel"),
    };

    const summaryText = generateSummary(trendData);

    const python = spawn("python", ["ml-etl/generate_report.py"]);
    const input = JSON.stringify({ trendData, summaryText });

    let result = "", error = "";

    python.stdin.write(input);
    python.stdin.end();

    python.stdout.on("data", (data) => (result += data.toString()));
    python.stderr.on("data", (data) => (error += data.toString()));

    python.on("close", (code) => {
      if (code === 0) {
        res.json({ success: true, message: "Report generated", path: "/api/report/download" });
      } else {
        res.status(500).json({ success: false, error });
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ GET /api/report/download (triggers download)
router.get("/download", (req, res) => {
  if (fs.existsSync(reportPath)) {
    res.download(reportPath, "salary-report.pdf");
  } else {
    res.status(404).json({ success: false, message: "PDF not found" });
  }
});

module.exports = router;
