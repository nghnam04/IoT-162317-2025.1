const housesService = require('../services/housesService');
const UserDeviceManagement = require('../models/UserDeviceManagement');
const Device = require('../models/Device');

/**
 * Control Controller
 * Xử lý các request điều khiển thiết bị
 * Gửi lệnh từ Client -> Houses_server -> ESP32
 */

/**
 * @route   POST /api/v1/control/device/:deviceId
 * @desc    Điều khiển thiết bị (Bật/Tắt máy bơm)
 * @params  deviceId
 * @body    { pump: "ON" | "OFF" }
 * @access  Private
 */
const controlDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { pump } = req.body;

    // Validate input
    if (!pump) {
      return res.status(400).json({
        success: false,
        message: 'pump is required',
      });
    }

    // Validate pump state
    const validStates = ['ON', 'OFF'];
    if (!validStates.includes(pump.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pump state. Must be ON or OFF',
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

    // Gọi sang Houses_server để gửi lệnh
    const result = await housesService.sendDeviceCommand(
      device.hardware_id,
      pump.toUpperCase()
    );

    // Log hành động của user
    console.log(`User ${req.user.username} controlled device ${device.hardware_id}, pump: ${pump}`);

    res.status(200).json({
      success: true,
      message: `Pump is being turned ${pump}`,
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
