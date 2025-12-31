const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Tất cả các routes đều cần authentication
router.use(authMiddleware);

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Tạo device mới
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - hardware_id
 *             properties:
 *               hardware_id:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Device created successfully
 */
router.post('/', deviceController.createDevice);

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Lấy danh sách devices của user
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', deviceController.getUserDevices);

/**
 * @swagger
 * /devices/{deviceId}:
 *   get:
 *     summary: Lấy thông tin chi tiết device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:deviceId', deviceController.getDeviceDetail);

/**
 * @swagger
 * /devices/{deviceId}/automation:
 *   put:
 *     summary: Cập nhật automation configs (Owner only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               automation_configs:
 *                 type: object
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/:deviceId/automation', deviceController.updateAutomationConfigs);

/**
 * @swagger
 * /devices/{deviceId}/share:
 *   post:
 *     summary: Share device với user khác (Owner only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [member]
 *     responses:
 *       201:
 *         description: Device shared successfully
 */
router.post('/:deviceId/share', deviceController.shareDevice);

/**
 * @swagger
 * /devices/{deviceId}/users/{userId}:
 *   delete:
 *     summary: Xóa user khỏi device (Owner only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed successfully
 */
router.delete('/:deviceId/users/:userId', deviceController.removeUserFromDevice);

/**
 * @swagger
 * /devices/{deviceId}/users:
 *   get:
 *     summary: Lấy danh sách users có quyền truy cập device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:deviceId/users', deviceController.getDeviceUsers);

/**
 * @swagger
 * /devices/{deviceId}/settings:
 *   put:
 *     summary: Cập nhật settings cá nhân cho device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alias_name:
 *                 type: string
 *               notifications:
 *                 type: object
 *               alert_settings:
 *                 type: object
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/:deviceId/settings', deviceController.updateUserDeviceSettings);

/**
 * @swagger
 * /devices/{deviceId}:
 *   delete:
 *     summary: Xóa device (Owner only)
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device deleted successfully
 */
router.delete('/:deviceId', deviceController.deleteDevice);

module.exports = router;
