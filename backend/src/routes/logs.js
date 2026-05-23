const express = require("express");
const PredictionLog = require("../models/PredictionLog");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const logs = await PredictionLog.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
