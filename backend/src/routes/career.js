const express = require("express");
const mlClient = require("../utils/mlClient");
const router = express.Router();

router.get("/all-paths", async (req, res) => {
  try { const { data } = await mlClient.get("/career/all-paths"); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post("/transition", async (req, res) => {
  try { const { data } = await mlClient.post("/career/transition", req.body); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.response?.data?.detail || err.message }); }
});

module.exports = router;
