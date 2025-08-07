const express = require("express");
const router = express.Router();
const path = require("path");
const { spawn } = require("child_process");
const Log = require("../models/Log");
const sendEmail = require("../utils/sendEmail");

router.post("/", (req, res) => {
  const pyScript = path.join(__dirname, "../../ml-etl/retrain.py");
  const pyExec = path.join(__dirname, "../../ml-etl/venv/Scripts/python.exe");

  const python = spawn(pyExec, [pyScript]);
  let output = "", errorOutput = "";

  python.stdout.on("data", (data) => output += data.toString());
  python.stderr.on("data", (data) => errorOutput += data.toString());

  python.on("close", async (code) => {
    if (code !== 0) return res.status(500).json({ success: false, message: "Retrain failed" });

    await Log.create({ action: "Retrain Model", detail: "Model updated with new dataset" });
    await sendEmail("✅ Salary-Sense Model Retrained", "Model has been retrained.");
    res.json({ success: true, message: "Model retrained" });
  });
});

module.exports = router;
