const express = require("express");
const mlClient = require("../utils/mlClient");
const router = express.Router();

router.get("/pool", async (req, res) => {
  try {
    const { data } = await mlClient.get("/model-pool/metrics");
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
