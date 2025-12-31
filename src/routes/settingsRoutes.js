const express = require('express');
const { body } = require('express-validator');
const settingsController = require('../controllers/settingsController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateRequest } = require('../middlewares/validatorMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @swagger
 * /settings:
 *   get:
 *     tags:
 *       - Settings (Deprecated)
 *     summary: Lấy cấu hình người dùng (DEPRECATED)
 *     description: |
 *       ⚠️ API này đã deprecated. Vui lòng sử dụng Device API thay thế:
 *       - GET /api/v1/devices - Lấy danh sách devices
 *       - GET /api/v1/devices/:deviceId - Lấy settings của device
 *     deprecated: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       410:
 *         description: Gone - Endpoint deprecated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This endpoint is deprecated
 */
router.get('/', settingsController.getSettings);

/**
 * @swagger
 * /settings:
 *   put:
 *     tags:
 *       - Settings (Deprecated)
 *     summary: Cập nhật cấu hình người dùng (DEPRECATED)
 *     description: |
 *       ⚠️ API này đã deprecated. Vui lòng sử dụng:
 *       - POST /api/v1/devices - Tạo device mới
 *       - PUT /api/v1/devices/:deviceId/settings - Cập nhật settings
 *     deprecated: true
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       410:
 *         description: Gone - Endpoint deprecated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: This endpoint is deprecated
 */
// PUT endpoint - Deprecated, không cần validation nữa
router.put('/', settingsController.updateSettings);

module.exports = router;
