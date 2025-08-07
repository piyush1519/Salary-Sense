// routes/predict.js
const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const Log = require("../models/Log");

const router = express.Router();

router.post("/", (req, res) => {
  const input = JSON.stringify(req.body);
  const pyScript = path.join(__dirname, "../../ml-etl/predict.py");
  const pyExec = path.join(__dirname, "../../ml-etl/venv/Scripts/python.exe");

  const python = spawn(pyExec, [pyScript]);
  let output = "", errorOutput = "";

  python.stdout.on("data", (data) => output += data.toString());
  python.stderr.on("data", (data) => errorOutput += data.toString());

  python.on("close", async (code) => {
    if (code !== 0) {
      console.error("❌ Python error:", errorOutput);
      return res.status(500).json({ success: false, message: "Prediction failed" });
    }

    try {
      const parsed = JSON.parse(output);
      await Log.create({ action: "Prediction", detail: JSON.stringify(req.body) });
      res.json(parsed);
    } catch (err) {
      console.error("❌ JSON parse error:", err);
      res.status(500).json({ success: false, message: "Invalid model output" });
    }
  });

  python.stdin.write(input);
  python.stdin.end();
});

module.exports = router;
