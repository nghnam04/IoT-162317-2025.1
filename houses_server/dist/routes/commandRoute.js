"use strict";

const command = require("../controllers/commandController");
const router = require("express").Router();
router.post("/", command.executeCommand);
module.exports = router;

/**
 * @swagger
 * /api/command/:
 *   post:
 *     summary: Send command to device
 *     tags: [Command]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - pump
 *             properties:
 *               sensorId:
 *                 type: string
 *                 example: esp32-27
 *               pump:
 *                 type: string
 *                 example: ON
 *     responses:
 *       200:
 *         description: Command sent successfully
 */