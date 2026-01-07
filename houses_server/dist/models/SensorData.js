"use strict";

const mongoose = require("mongoose");
const SensorDataSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true
  },
  humidity: Number,
  temperature: Number,
  soil_moisture: Number,
  light_level: Number,
  pump_state: {
    type: String,
    enum: ["ON", "OFF"],
    default: "OFF"
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
const SensorData = mongoose.model("SensorData", SensorDataSchema);
module.exports = SensorData;