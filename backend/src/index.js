require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const logger = require("./utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.options("*", cors());

// ── Rate Limiting ─────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    error: "Too many requests, please try again later.",
  },
});

app.use("/api/", limiter);

// ── Middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  morgan("combined", {
    stream: {
      write: (msg) => logger.info(msg.trim()),
    },
  })
);

// ── Database ──────────────────────────────────────────────────────────
connectDB();

// ── Health Check ──────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "salary-sense-backend",
    timestamp: new Date().toISOString(),
  });
});

// ── Root Route ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Salary-Sense API v2.0",
  });
});

// ── API Routes ────────────────────────────────────────────────────────
app.use("/api/auth", require("./routes/auth"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/trends", require("./routes/trends"));
app.use("/api/models", require("./routes/models"));
app.use("/api/explain", require("./routes/explain"));
app.use("/api/skill-gap", require("./routes/skillGap"));
app.use("/api/career", require("./routes/career"));

app.use(
  "/api/admin",
  require("./middleware/auth"),
  require("./routes/admin")
);

app.use("/api/logs", require("./routes/logs"));

// ── Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ──────────────────────────────────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`✅ Backend running on port ${PORT}`);
});