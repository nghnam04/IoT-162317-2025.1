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
 * @route   GET /api/v1/settings
 * @desc    Lấy cấu hình của user hiện tại
 * @access  Private
 */
router.get('/', settingsController.getSettings);

/**
 * @route   PUT /api/v1/settings
 * @desc    Cập nhật cấu hình của user
 * @body    { notifications: {...}, thresholds: {...} }
 * @access  Private
 */
router.put(
  '/',
  [
    body('notifications.email_alert')
      .optional()
      .isBoolean()
      .withMessage('email_alert must be boolean'),
    body('notifications.push_alert')
      .optional()
      .isBoolean()
      .withMessage('push_alert must be boolean'),
    body('thresholds.max_temp')
      .optional()
      .isNumeric()
      .withMessage('max_temp must be a number'),
    body('thresholds.min_humidity')
      .optional()
      .isNumeric()
      .withMessage('min_humidity must be a number'),
    body('thresholds.max_humidity')
      .optional()
      .isNumeric()
      .withMessage('max_humidity must be a number'),
    body('thresholds.min_light')
      .optional()
      .isNumeric()
      .withMessage('min_light must be a number'),
    validateRequest,
  ],
  settingsController.updateSettings
);

module.exports = router;
