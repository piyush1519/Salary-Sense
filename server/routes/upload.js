const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Dataset = require("../models/Dataset");
const Log = require("../models/Log");

const upload = multer({ dest: path.join(__dirname, "../../ml-etl/uploads/") });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "../../ml-etl/uploads/dataset.csv");

  fs.rename(tempPath, targetPath, async (err) => {
    if (err) return res.status(500).json({ message: "Failed to save file" });

    await Dataset.create({ filename: "dataset.csv" });
    await Log.create({ action: "Upload Dataset", detail: "File: dataset.csv" });
    res.json({ success: true, message: "Dataset uploaded" });
  });
});

module.exports = router;
