"use strict";

const {
  sendCommand
} = require("../rabbitmq/publisher");
const executeCommand = async (req, res) => {
  const {
    sensorId,
    pump
  } = req.body;
  await sendCommand(sensorId, pump);
  res.json({
    message: "Command sent successfully"
  });
};
module.exports = {
  executeCommand
};