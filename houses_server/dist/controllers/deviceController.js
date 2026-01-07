"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStatus = void 0;
const SensorData = require("../models/SensorData");
const getStatus = async (req, res) => {
  const {
    sensorId
  } = req.query;
  if (!sensorId) return res.status(400).json({
    error: "sensorId query parameter is required"
  });
  const latest = await SensorData.findOne({
    sensorId
  }).sort({
    timestamp: -1
  });
  res.json(latest || {});
};
exports.getStatus = getStatus;