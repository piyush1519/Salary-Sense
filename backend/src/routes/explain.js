const express = require("express");
const mlClient = require("../utils/mlClient");
const router = express.Router();

router.post("/shap", async (req, res) => {
  try {
    const { data } = await mlClient.post("/explain/shap", req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
