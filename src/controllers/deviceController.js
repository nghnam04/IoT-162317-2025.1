const deviceService = require('../services/deviceService');

/**
 * Device Controller
 * Xử lý các request liên quan đến Device và UserDeviceManagement
 */

/**
 * @route   POST /api/v1/devices
 * @desc    Tạo device mới và register user làm owner
 * @body    { hardware_id, name?, type?, automation_configs? }
 * @access  Private
 */
const createDevice = async (req, res, next) => {
  try {
    const { hardware_id, name, type, automation_configs } = req.body;

    if (!hardware_id) {
      return res.status(400).json({
        success: false,
        message: 'hardware_id is required'
      });
    }

    const result = await deviceService.createDevice(
      { hardware_id, name, type, automation_configs },
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: {
        device: result.device,
        management: result.management
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to create device'
    });
  }
};

/**
 * @route   GET /api/v1/devices
 * @desc    Lấy danh sách tất cả devices của user
 * @access  Private
 */
const getUserDevices = async (req, res, next) => {
  try {
    const devices = await deviceService.getUserDevices(req.user._id);

    res.status(200).json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get devices'
    });
  }
};

/**
 * @route   GET /api/v1/devices/:deviceId
 * @desc    Lấy thông tin chi tiết một device
 * @access  Private
 */
const getDeviceDetail = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const result = await deviceService.getDeviceDetail(deviceId, req.user._id);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get device detail'
    });
  }
};

/**
 * @route   PUT /api/v1/devices/:deviceId/automation
 * @desc    Cập nhật automation configs (chỉ owner)
 * @body    { automation_configs }
 * @access  Private (Owner only)
 */
const updateAutomationConfigs = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { automation_configs } = req.body;

    if (!automation_configs) {
      return res.status(400).json({
        success: false,
        message: 'automation_configs is required'
      });
    }

    const device = await deviceService.updateAutomationConfigs(
      deviceId,
      req.user._id,
      automation_configs
    );

    res.status(200).json({
      success: true,
      message: 'Automation configs updated successfully',
      data: device
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update automation configs'
    });
  }
};

/**
 * @route   POST /api/v1/devices/:deviceId/share
 * @desc    Share device với user khác (chỉ owner)
 * @body    { user_id, role? }
 * @access  Private (Owner only)
 */
const shareDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { user_id, role } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'user_id is required'
      });
    }

    const management = await deviceService.shareDevice(
      deviceId,
      req.user._id,
      user_id,
      role || 'member'
    );

    res.status(201).json({
      success: true,
      message: 'Device shared successfully',
      data: management
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to share device'
    });
  }
};

/**
 * @route   DELETE /api/v1/devices/:deviceId/users/:userId
 * @desc    Xóa user khỏi device (chỉ owner)
 * @access  Private (Owner only)
 */
const removeUserFromDevice = async (req, res, next) => {
  try {
    const { deviceId, userId } = req.params;

    const result = await deviceService.removeUserFromDevice(
      deviceId,
      req.user._id,
      userId
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove user'
    });
  }
};

/**
 * @route   GET /api/v1/devices/:deviceId/users
 * @desc    Lấy danh sách users có quyền truy cập device
 * @access  Private
 */
const getDeviceUsers = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const users = await deviceService.getDeviceUsers(deviceId, req.user._id);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get device users'
    });
  }
};

/**
 * @route   PUT /api/v1/devices/:deviceId/settings
 * @desc    Cập nhật settings cá nhân (alias_name, notifications, alert_settings)
 * @body    { alias_name?, notifications?, alert_settings? }
 * @access  Private
 */
const updateUserDeviceSettings = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const { alias_name, notifications, alert_settings } = req.body;

    const management = await deviceService.updateUserDeviceSettings(
      deviceId,
      req.user._id,
      { alias_name, notifications, alert_settings }
    );

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        alias_name: management.alias_name,
        notifications: management.notifications,
        alert_settings: management.alert_settings
      }
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update settings'
    });
  }
};

/**
 * @route   DELETE /api/v1/devices/:deviceId
 * @desc    Xóa device (chỉ owner)
 * @access  Private (Owner only)
 */
const deleteDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;

    const result = await deviceService.deleteDevice(deviceId, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to delete device'
    });
  }
};

module.exports = {
  createDevice,
  getUserDevices,
  getDeviceDetail,
  updateAutomationConfigs,
  shareDevice,
  removeUserFromDevice,
  getDeviceUsers,
  updateUserDeviceSettings,
  deleteDevice
};
