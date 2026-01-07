const express = require('express');
const { body } = require('express-validator');
const controlController = require('../controllers/controlController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validatorMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /control/device/{deviceId}:
 *   post:
 *     tags:
 *       - Control
 *     summary: Điều khiển thiết bị
 *     description: |
 *       Bật/Tắt/Auto máy bơm của device.
 *       
 *       **AUTO Mode:** ESP32 và Houses_server sẽ tự động kiểm tra độ ẩm đất và điều khiển bơm dỳa trên ngưỡng đã cấu hình tại ESP32.
 *       
 *       Sử dụng API `/monitor/device/{id}/current` để lấy trạng thái pump thực tế từ Houses_server.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pump
 *             properties:
 *               pump:
 *                 type: string
 *                 description: |
 *                   Trạng thái bơm:
 *                   - ON: Bật thủ công
 *                   - OFF: Tắt
 *                   - AUTO: ESP32 tự động kiểm soát dựa trên ngưỡng độ ẩm
 *                 enum: [ON, OFF, AUTO]
 *                 example: AUTO
 *     responses:
 *       200:
 *         description: Lệnh điều khiển thành công
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
 *                   example: Auto pump mode activated. ESP32 will automatically control pump based on soil moisture threshold.
 *                 data:
 *                   type: object
 *                   properties:
 *                     pump_mode:
 *                       type: string
 *                       example: AUTO
 *                     houses_response:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: Command sent successfully
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       503:
 *         description: Houses Server không khả dụng
 */
router.post(
  '/device/:deviceId',
  [
    body('pump')
      .trim()
      .notEmpty()
      .withMessage('pump is required')
      .isIn(['ON', 'OFF', 'AUTO', 'on', 'off', 'auto'])
      .withMessage('pump must be ON, OFF, or AUTO'),
    validateRequest,
  ],
  controlController.controlDevice
);

module.exports = router;
