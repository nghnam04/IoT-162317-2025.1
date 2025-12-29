const express = require('express');
const monitorController = require('../controllers/monitorController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Tất cả routes trong file này đều yêu cầu authentication
 */
router.use(authMiddleware);

/**
 * @route   GET /api/v1/monitor/current
 * @desc    Lấy dữ liệu cảm biến hiện tại (real-time)
 * @access  Private
 */
router.get('/current', monitorController.getCurrentData);

/**
 * @route   GET /api/v1/monitor/history
 * @desc    Lấy lịch sử dữ liệu cảm biến
 * @query   startDate, endDate, type (temp, humidity, light)
 * @access  Private
 */
router.get('/history', monitorController.getHistoryData);

/**
 * @route   GET /api/v1/monitor/devices/status
 * @desc    Lấy trạng thái tất cả thiết bị
 * @access  Private
 */
router.get('/devices/status', monitorController.getDevicesStatus);

module.exports = router;
