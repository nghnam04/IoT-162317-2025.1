"use strict";

var _cors = _interopRequireDefault(require("cors"));
var _express = _interopRequireDefault(require("express"));
var _index = require("./routes/index.js");
var _db = _interopRequireDefault(require("./config/db.js"));
var _rabbitmq = require("./config/rabbitmq.js");
var _consumer = require("./rabbitmq/consumer.js");
var _swagger = _interopRequireDefault(require("./config/swagger.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
require("dotenv").config();
const app = (0, _express.default)();
app.use((0, _cors.default)({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
(0, _swagger.default)(app);
(0, _index.initRoutes)(app);
const startServer = async () => {
  try {
    await (0, _db.default)();
    await (0, _rabbitmq.connectRabbitMQ)();
    await (0, _consumer.startConsumer)();
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