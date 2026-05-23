const express = require("express");
const mlClient = require("../utils/mlClient");
const router = express.Router();

router.get("/roles", async (req, res) => {
  try { const { data } = await mlClient.get("/skill-gap/roles"); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.get("/all-skills", async (req, res) => {
  try { const { data } = await mlClient.get("/skill-gap/all-skills"); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post("/analyze", async (req, res) => {
  try { const { data } = await mlClient.post("/skill-gap/analyze", req.body); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.response?.data?.detail || err.message }); }
});

router.get("/market-skills", async (req, res) => {
  try { const { data } = await mlClient.get("/skill-gap/market-skills"); res.json(data); }
  catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
