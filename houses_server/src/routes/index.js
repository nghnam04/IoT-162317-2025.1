const historyRouter = require("./historyRoute");
const deviceRouter = require("./deviceRoute");
const commandRouter = require("./commandRoute");

const initRoutes = (app) => {
  app.use("/api/history", historyRouter);

  app.use("/api/device/status", deviceRouter);

  app.use("/api/command", commandRouter);

  return app.use("/", (req, res) => {
    return res.send("Server is working");
  });
};

export { initRoutes };

/**
 * @swagger
 * tags:
 *   - name: History
 *     description: Sensor data history APIs
 *   - name: Device
 *     description: Device status APIs
 *   - name: Command
 *     description: Command control APIs
 */
