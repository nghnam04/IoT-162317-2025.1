const housesService = require('../services/housesService');

/**
 * Monitor Controller
 * Xử lý các request liên quan đến monitoring
 * Các API này sẽ gọi sang Houses_server
 */

/**
 * @route   GET /api/v1/monitor/current
 * @desc    Lấy dữ liệu cảm biến hiện tại (real-time)
 * @access  Private
 */
const getCurrentData = async (req, res, next) => {
  try {
    // Gọi sang Houses_server
    const result = await housesService.getLatestSensorData();

    res.status(200).json({
      success: true,
      message: 'Latest sensor data retrieved successfully',
      data: result.data,
    });
  } catch (error) {
    // Nếu Houses_server không khả dụng
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to retrieve sensor data',
    });
  }
};

/**
 * @route   GET /api/v1/monitor/history
 * @desc    Lấy lịch sử dữ liệu cảm biến (để vẽ biểu đồ)
 * @query   startDate, endDate, type (temp, humidity, light)
 * @access  Private
 */
const getHistoryData = async (req, res, next) => {
  try {
    const { startDate, endDate, type } = req.query;

    // Validate query params
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate and endDate are required',
      });
    }

    // Gọi sang Houses_server
    const result = await housesService.getSensorHistory({
      startDate,
      endDate,
      type,
    });

    res.status(200).json({
      success: true,
      message: 'Sensor history retrieved successfully',
      data: result.data,
    });
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to retrieve sensor history',
    });
  }
};

/**
 * @route   GET /api/v1/monitor/devices/status
 * @desc    Lấy trạng thái tất cả thiết bị
 * @access  Private
 */
const getDevicesStatus = async (req, res, next) => {
  try {
    // Gọi sang Houses_server
    const result = await housesService.getDevicesStatus();

    res.status(200).json({
      success: true,
      message: 'Devices status retrieved successfully',
      data: result.data,
    });
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to retrieve devices status',
    });
  }
};

module.exports = {
  getCurrentData,
  getHistoryData,
  getDevicesStatus,
};
