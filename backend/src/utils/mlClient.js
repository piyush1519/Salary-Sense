const axios = require("axios");

const ML_URL = process.env.ML_SERVICE_URL || "http://ml-service:8000";

const mlClient = axios.create({
  baseURL: ML_URL,
  timeout: 60000,
});

module.exports = mlClient;
