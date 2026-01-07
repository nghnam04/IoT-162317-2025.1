const status = require("../controllers/deviceController");

const router = require("express").Router();

router.get("/", status.getStatus);

module.exports = router;

/**
 * @swagger
 * /api/device/status/:
 *   get:
 *     summary: Get latest device status
 *     tags: [Device]
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Device ID to get latest status
 *         example: esp32-27
 *     responses:
 *       200:
 *         description: Latest device status
 *       400:
 *         description: SensorId query parameter is required
 */
