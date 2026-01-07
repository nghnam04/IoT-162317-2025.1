const SensorData = require("../models/SensorData");

export const getStatus = async (req, res) => {
  const { sensorId } = req.query;
  if (!sensorId)
    return res
      .status(400)
      .json({ error: "sensorId query parameter is required" });

  const latest = await SensorData.findOne({ sensorId }).sort({ timestamp: -1 });

  res.json(latest);
};
