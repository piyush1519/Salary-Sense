const express = require("express");
const User = require("../models/User");
const PredictionLog = require("../models/PredictionLog");
const { adminOnly } = require("../middleware/auth");
const router = express.Router();

router.use(adminOnly);

router.get("/stats", async (req, res) => {
  try {
    const [users, predictions] = await Promise.all([
      User.countDocuments(),
      PredictionLog.countDocuments(),
    ]);
    res.json({ success: true, data: { totalUsers: users, totalPredictions: predictions } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
