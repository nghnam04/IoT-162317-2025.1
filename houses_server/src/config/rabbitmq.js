const amqp = require("amqplib");

let channel;

const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  await channel.assertQueue(process.env.SENSOR_DATA_QUEUE, { durable: true });
  console.log("RabbitMQ connected, channel created");
};

const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }
  return channel;
};

module.exports = { connectRabbitMQ, getChannel };
