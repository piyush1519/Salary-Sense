const mongoose = require("mongoose");

const predictionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  input: { type: Object, required: true },
  output: { type: Object, required: true },
  modelUsed: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PredictionLog", predictionLogSchema);
