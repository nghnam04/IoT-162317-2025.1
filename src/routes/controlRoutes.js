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
 * @route   POST /api/v1/control/device
 * @desc    Điều khiển thiết bị (Bật/Tắt máy bơm, đèn, etc.)
 * @body    { deviceId: "PUMP", action: "ON" }
 * @access  Private
 */
router.post(
  '/device',
  [
    body('deviceId')
      .trim()
      .notEmpty()
      .withMessage('deviceId is required')
      .toUpperCase(),
    body('action')
      .trim()
      .notEmpty()
      .withMessage('action is required')
      .isIn(['ON', 'OFF', 'on', 'off'])
      .withMessage('action must be ON or OFF'),
    validateRequest,
  ],
  controlController.controlDevice
);

module.exports = router;
