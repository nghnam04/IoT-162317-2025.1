const housesService = require('../services/housesService');
const UserDeviceManagement = require('../models/UserDeviceManagement');

/**
 * Monitor Controller
 * Xử lý các request liên quan đến monitoring
 * Các API này sẽ gọi sang Houses_server
 */

/**
 * @route   GET /api/v1/monitor/:deviceId/current
 * @desc    Lấy dữ liệu cảm biến hiện tại (real-time) của device
 * @params  deviceId
 * @access  Private
 */
const getCurrentData = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    // Kiểm tra user có quyền truy cập device này không
    const management = await UserDeviceManagement.findOne({
      device: deviceId,
      user: req.user._id
    }).populate('device');

    if (!management) {
      return res.status(404).json({
        success: false,
        message: 'Device not found or you do not have access'
      });
    }

    const device = management.device;
    
    // Gọi sang Houses_server
    const result = await housesService.getLatestSensorData(device.hardware_id);

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
 * @route   GET /api/v1/monitor/:deviceId/history
 * @desc    Lấy lịch sử dữ liệu cảm biến của device (để vẽ biểu đồ)
 * @params  deviceId
 * @query   from (ISO 8601), to (ISO 8601)
 * @access  Private
 */
const getHistoryData = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { from, to } = req.query;

    // Validate query params
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: 'from and to are required (ISO 8601 format)',
      });
    }

    // Kiểm tra user có quyền truy cập device này không
    const management = await UserDeviceManagement.findOne({
      device: deviceId,
      user: req.user._id
    }).populate('device');

    if (!management) {
      return res.status(404).json({
        success: false,
        message: 'Device not found or you do not have access'
      });
    }

    const device = management.device;

    // Gọi sang Houses_server
    const result = await housesService.getSensorHistory(device.hardware_id, from, to);

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

module.exports = {
  getCurrentData,
  getHistoryData,
};
