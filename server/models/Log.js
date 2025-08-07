// models/Log.js
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  action: String,
  detail: String,
});

module.exports = mongoose.model("Log", logSchema);
