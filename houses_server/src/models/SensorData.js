const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema({
  sensorId: { type: String, required: true },
  humidity: Number,
  temperature: Number,
  soil_moisture: Number,
  light_level: Number,
  status: { type: String, enum: ["ONLINE", "OFFLINE"] },
  pump_state: { type: String, enum: ["ON", "OFF"], default: "OFF" },
  timestamp: { type: Date },
});

const SensorData = mongoose.model("SensorData", SensorDataSchema);

module.exports = SensorData;
