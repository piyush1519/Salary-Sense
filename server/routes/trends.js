const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const datasetPath = path.join(__dirname, "../../ml-etl/uploads/dataset.csv");

// helper
const readCSV = (onRow, onEnd, onError) => {
  if (!fs.existsSync(datasetPath)) return onError("Dataset not found");
  fs.createReadStream(datasetPath)
    .pipe(csv())
    .on("data", onRow)
    .on("end", onEnd)
    .on("error", onError);
};

const averageByField = (field) => {
  const sums = {};
  const counts = {};

  return new Promise((resolve, reject) => {
    readCSV(
      (row) => {
        const label = row[field];
        const salary = parseFloat(row["Salary"]);
        if (label && !isNaN(salary)) {
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

// ✅ 1. Org Size
router.get("/org-size", async (req, res) => {
  try {
    const data = await averageByField("OrgSize");
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
});

// ✅ 2. Experience
router.get("/experience", async (req, res) => {
  try {
    const sums = {};
    const counts = {};
    readCSV(
      (row) => {
        const exp = row["YearsCodePro"];
        const salary = parseFloat(row["Salary"]);
        if (exp && !isNaN(salary) && !isNaN(parseFloat(exp))) {
          sums[exp] = (sums[exp] || 0) + salary;
          counts[exp] = (counts[exp] || 0) + 1;
        }
      },
      () => {
        const data = Object.keys(sums)
          .map((exp) => ({
            label: exp,
            avgSalary: parseFloat((sums[exp] / counts[exp]).toFixed(2)),
          }))
          .sort((a, b) => parseFloat(a.label) - parseFloat(b.label));
        res.json({ success: true, data });
      },
      (err) => res.status(500).json({ success: false, message: err.toString() })
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
});

// ✅ 3. Work Mode (string field now!)
router.get("/workmode", async (req, res) => {
  try {
    const data = await averageByField("WorkMode");  // 👈 updated to string
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
});

// ✅ 4. Education (string field now!)
router.get("/education", async (req, res) => {
  try {
    const data = await averageByField("Education");  // 👈 updated to string
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
});

// ✅ 5. Region (string field now!)
router.get("/region", async (req, res) => {
  try {
    const data = await averageByField("Region");  // 👈 updated to string
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.toString() });
  }
});

module.exports = router;
