const { getChannel } = require("../config/rabbitmq");

const sendCommand = async (sensorId, pump) => {
  const channel = getChannel();

  const exchangeName = "amq.topic";
  const routingKey = `control.commands.${sensorId}`;

  const message = {
    sensorId,
    pump,
    timestamp: new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
  };

  // publish vào exchange, routingKey = topic MQTT
  channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );

  console.log(`Sent command to device ${sensorId}:`, message);
};

module.exports = { sendCommand };
