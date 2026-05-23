const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// Register
router.post("/register", [
  body("name").notEmpty().trim(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
  body("role").optional().isIn(["developer", "recruiter"]),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, email, password, role = "developer" } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, role });
    const token = signToken(user);
    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Login
router.post("/login", [
  body("email").isEmail(),
  body("password").notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    user.lastLogin = new Date();
    await user.save();
    const token = signToken(user);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Demo login (no password needed for demo)
router.post("/demo", async (req, res) => {
  const { role = "developer" } = req.body;
  const demoUser = { _id: `demo-${role}`, name: `Demo ${role}`, email: `demo@salarysense.ai`, role };
  const token = jwt.sign(demoUser, process.env.JWT_SECRET, { expiresIn: "24h" });
  res.json({ success: true, token, user: demoUser });
});

module.exports = router;
