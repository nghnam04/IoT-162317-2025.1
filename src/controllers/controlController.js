const housesService = require('../services/housesService');

/**
 * Control Controller
 * Xử lý các request điều khiển thiết bị
 * Gửi lệnh từ Client -> Houses_server -> ESP32
 */

/**
 * @route   POST /api/v1/control/device
 * @desc    Điều khiển thiết bị (Bật/Tắt máy bơm, đèn, etc.)
 * @body    { deviceId: "PUMP", action: "ON" }
 * @access  Private
 */
const controlDevice = async (req, res, next) => {
  try {
    const { deviceId, action } = req.body;

    // Validate input
    if (!deviceId || !action) {
      return res.status(400).json({
        success: false,
        message: 'deviceId and action are required',
      });
    }

    // Validate action
    const validActions = ['ON', 'OFF'];
    if (!validActions.includes(action.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be ON or OFF',
      });
    }

    // Gọi sang Houses_server để gửi lệnh
    const result = await housesService.sendDeviceCommand(
      deviceId.toUpperCase(),
      action.toUpperCase()
    );

    // Log hành động của user (optional - có thể lưu vào DB)
    console.log(`User ${req.user.username} controlled device ${deviceId}: ${action}`);

    res.status(200).json({
      success: true,
      message: `Device ${deviceId} is being turned ${action}`,
      data: result.data,
    });
  } catch (error) {
    res.status(error.statusCode || 503).json({
      success: false,
      message: error.message || 'Failed to control device',
    });
  }
};

module.exports = {
  controlDevice,
};
