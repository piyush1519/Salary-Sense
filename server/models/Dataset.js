// models/Dataset.js
const mongoose = require("mongoose");

const datasetSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Dataset", datasetSchema);
