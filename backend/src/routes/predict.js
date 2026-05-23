const express = require("express");
const mlClient = require("../utils/mlClient");
const PredictionLog = require("../models/PredictionLog");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { data } = await mlClient.post("/predict", req.body);

    // Log prediction (fire-and-forget)
    PredictionLog.create({
      userId: req.user?.id,
      input: req.body,
      output: data,
      modelUsed: data.modelUsed,
    }).catch(() => {});

    res.json(data);
  } catch (err) {
    const msg = err.response?.data?.detail || err.message;
    res.status(500).json({ success: false, message: "Prediction failed: " + msg });
  }
});

router.post("/all-models", async (req, res) => {
  try {
    const { data } = await mlClient.post("/predict/all-models", req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
