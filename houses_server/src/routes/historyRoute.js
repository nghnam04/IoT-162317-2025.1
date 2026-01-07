const history = require("../controllers/historyController");

const router = require("express").Router();

router.get("/", history.getHistory);

module.exports = router;

/**
 * @swagger
 * /api/history/:
 *   get:
 *     summary: Get sensor data history by device and time range
 *     tags: [History]
 *     parameters:
 *       - in: query
 *         name: sensorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Sensor ID to filter sensor data
 *         example: esp32-27
 *       - in: query
 *         name: from
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start time (ISO 8601)
 *         example: 2025-01-01T00:00:00Z
 *       - in: query
 *         name: to
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End time (ISO 8601)
 *         example: 2025-01-02T00:00:00Z
 *     responses:
 *       200:
 *         description: List of sensor data (max 100 records)
 *       400:
 *         description: SensorId query parameter is required
 */
