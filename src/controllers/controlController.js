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
 * @desc    Điều khiển thiết bị (Bật/Tắt/Auto máy bơm)
 * @params  deviceId
 * @body    { pump: "ON" | "OFF" | "AUTO" }
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

    // Validate pump state - Bây giờ hỗ trợ AUTO
    const validStates = ['ON', 'OFF', 'AUTO'];
    if (!validStates.includes(pump.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pump state. Must be ON, OFF, or AUTO',
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
    const pumpState = pump.toUpperCase();

    // Cập nhật pump_mode trong database
    device.pump_mode = pumpState;
    await device.save();

    // Gọi sang Houses_server để gửi lệnh
    const result = await housesService.sendDeviceCommand(
      device.hardware_id,
      pumpState
    );

    // Log hành động của user
    console.log(`User ${req.user.username} controlled device ${device.hardware_id}, pump: ${pumpState}`);

    // Message khác nhau cho từng mode
    let message;
    if (pumpState === 'AUTO') {
      message = 'Auto pump mode activated. ESP32 will automatically control pump based on soil moisture threshold.';
    } else {
      message = `Pump is being turned ${pumpState}`;
    }

    res.status(200).json({
      success: true,
      message: message,
      data: {
        pump_mode: pumpState,
        houses_response: result.data
      },
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
