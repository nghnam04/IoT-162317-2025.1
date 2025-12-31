const express = require('express');
const monitorController = require('../controllers/monitorController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /monitor/{deviceId}/current:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Lấy dữ liệu cảm biến hiện tại của device
 *     description: Lấy dữ liệu real-time từ các cảm biến (nhiệt độ, độ ẩm, ánh sáng, độ ẩm đất)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của device
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Latest sensor data retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/SensorData'
 *       503:
 *         description: Houses Server không khả dụng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:deviceId/current', monitorController.getCurrentData);

/**
 * @swagger
 * /monitor/{deviceId}/history:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Lấy lịch sử dữ liệu cảm biến của device
 *     description: Lấy dữ liệu lịch sử để vẽ biểu đồ (max 100 records)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của device
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Thời gian bắt đầu (ISO 8601 format)
 *         example: 2025-01-01T00:00:00Z
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Thời gian kết thúc (ISO 8601 format)
 *         example: 2026-01-02T00:00:00Z
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SensorData'
 *       400:
 *         description: Thiếu tham số bắt buộc
 *       503:
 *         description: Houses Server không khả dụng
 */
router.get('/:deviceId/history', monitorController.getHistoryData);

module.exports = router;
