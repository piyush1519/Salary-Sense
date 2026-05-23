const express = require("express");
const mlClient = require("../utils/mlClient");
const router = express.Router();

const proxy = (path) => async (req, res) => {
  try {
    const { data } = await mlClient.get(path);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

router.get("/salary-by-experience", proxy("/trends/salary-by-experience"));
router.get("/salary-by-region", proxy("/trends/salary-by-region"));
router.get("/salary-by-education", proxy("/trends/salary-by-education"));
router.get("/salary-by-workmode", proxy("/trends/salary-by-workmode"));
router.get("/salary-by-orgsize", proxy("/trends/salary-by-orgsize"));
router.get("/distribution", proxy("/trends/distribution"));

module.exports = router;
