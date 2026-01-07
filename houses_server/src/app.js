import cors from "cors";
import express from "express";
import { initRoutes } from "./routes/index.js";
import connectDB from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import { startConsumer } from "./rabbitmq/consumer.js";
import setupSwagger from "./config/swagger.js";
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);
initRoutes(app);

const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await startConsumer();
    const PORT = process.env.PORT || 4000;

    const listener = app.listen(PORT, () => {
      console.log(`Server is running on port ${listener.address().port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
