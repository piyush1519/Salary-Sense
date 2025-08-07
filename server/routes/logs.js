const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json({ success: true, data: logs });
  } catch {
    res.status(500).json({ success: false, message: "Failed to load logs" });
  }
});

module.exports = router;
