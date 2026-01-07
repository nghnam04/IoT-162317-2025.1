"use strict";

const {
  getChannel
} = require("../config/rabbitmq");
const SensorData = require("../models/SensorData");
const startConsumer = async () => {
  const channel = getChannel();
  channel.consume(process.env.SENSOR_DATA_QUEUE, async msg => {
    if (msg == null) return;
    try {
      //   console.log("Consuming queue", process.env.SENSOR_DATA_QUEUE);
      //   console.log("Message", msg);
      const sensorData = JSON.parse(msg.content.toString());
      const timestamp = new Date().toISOString();
      if (!sensorData.sensorId) {
        channel.ack(msg);
        return;
      }
      await SensorData.create({
        ...sensorData,
        timestamp: new Date().toLocaleString("sv-SE", {
          timeZone: "Asia/Ho_Chi_Minh"
        })
      });
      channel.ack(msg);
      console.log(`Processed sensor data from device ${sensorData.sensorId} at ${timestamp}`);
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
};
module.exports = {
  startConsumer
};