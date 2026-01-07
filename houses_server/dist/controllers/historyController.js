"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHistory = void 0;
const SensorData = require("../models/SensorData");
const getHistory = async (req, res) => {
  const {
    sensorId,
    from,
    to
  } = req.query;
  if (!sensorId) {
    return res.status(400).json({
      error: "sensorId query parameter is required"
    });
  }
  const query = {
    sensorId
  };
  if (from || to) {
    query.timestamp = {};
    if (from) {
      query.timestamp.$gte = new Date(from);
    }
    if (to) {
      query.timestamp.$lte = new Date(to);
    }
  }
  const histosy = await SensorData.find(query).sort({
    timestamp: -1
  }).limit(100);
  res.json(histosy);
};
exports.getHistory = getHistory;