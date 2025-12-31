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
 *     description: Bật/Tắt máy bơm của device
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
 *                 description: Trạng thái bơm
 *                 enum: [ON, OFF]
 *                 example: ON
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
 *                   example: Pump is being turned ON
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Command sent successfully
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
      .isIn(['ON', 'OFF', 'on', 'off'])
      .withMessage('pump must be ON or OFF'),
    validateRequest,
  ],
  controlController.controlDevice
);

module.exports = router;
