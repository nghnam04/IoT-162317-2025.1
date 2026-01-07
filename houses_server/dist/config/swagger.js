"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));
var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "House Server API",
      version: "1.1.0",
      description: "API documentation for House IoT Server"
    },
    servers: [{
      url: "http://localhost:5000",
      description: "Local server"
    }, {
      url: "http://34.44.49.190:30050",
      description: "Production server"
    }]
  },
  apis: ["./src/routes/*.js", "./dist/routes/**/*.js"]
};
const swaggerSpec = (0, _swaggerJsdoc.default)(swaggerOptions);
const setupSwagger = app => {
  app.use("/api-docs", _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(swaggerSpec));
};
var _default = exports.default = setupSwagger;