const Device = require('../models/Device');
const UserDeviceManagement = require('../models/UserDeviceManagement');

/**
 * Device Service
 * Service layer để xử lý logic liên quan đến Device
 */

/**
 * Tạo device mới
 * @param {Object} deviceData - Dữ liệu device
 * @param {String} ownerId - ID của user sở hữu device
 * @returns {Object} Device và UserDeviceManagement record
 */
const createDevice = async (deviceData, ownerId) => {
  const { hardware_id, name, type, automation_configs } = deviceData;

  // Kiểm tra xem hardware_id đã tồn tại chưa
  const existingDevice = await Device.findOne({ hardware_id });
  if (existingDevice) {
    throw {
      statusCode: 400,
      message: 'Device with this hardware_id already exists'
    };
  }

  // Tạo device
  const device = await Device.create({
    hardware_id,
    name: name || 'Smart Garden Device',
    type: type || 'Sensor',
    automation_configs: automation_configs || {}
  });

  // Tạo record UserDeviceManagement với role owner
  const management = await UserDeviceManagement.create({
    user: ownerId,
    device: device._id,
    role: 'owner'
  });

  return {
    device,
    management
  };
};

/**
 * Lấy danh sách tất cả devices của user
 * @param {String} userId - ID của user
 * @returns {Array} Danh sách devices
 */
const getUserDevices = async (userId) => {
  const managements = await UserDeviceManagement.find({ user: userId })
    .populate('device')
    .sort({ createdAt: -1 });

  return managements.map(m => ({
    management_id: m._id,
    device_id: m.device._id,
    hardware_id: m.device.hardware_id,
    name: m.device.name,
    type: m.device.type,
    alias_name: m.alias_name,
    role: m.role,
    created_at: m.createdAt
  }));
};

/**
 * Lấy thông tin chi tiết một device
 * @param {String} deviceId - ID của device
 * @param {String} userId - ID của user (để kiểm tra quyền)
 * @returns {Object} Device info
 */
const getDeviceDetail = async (deviceId, userId) => {
  // Kiểm tra user có quyền truy cập device này không
  const management = await UserDeviceManagement.findOne({
    device: deviceId,
    user: userId
  }).populate('device');

  if (!management) {
    throw {
      statusCode: 404,
      message: 'Device not found or you do not have access'
    };
  }

  return {
    device: management.device,
    management: {
      role: management.role,
      alias_name: management.alias_name,
      notifications: management.notifications,
      alert_settings: management.alert_settings,
      last_alert_sent: management.last_alert_sent
    }
  };
};

/**
 * Cập nhật automation configs (chỉ owner)
 * @param {String} deviceId - ID của device
 * @param {String} userId - ID của user
 * @param {Object} automationConfigs - Cấu hình tự động mới
 * @returns {Object} Updated device
 */
const updateAutomationConfigs = async (deviceId, userId, automationConfigs) => {
  // Kiểm tra user có phải owner không
  const management = await UserDeviceManagement.findOne({
    device: deviceId,
    user: userId,
    role: 'owner'
  });

  if (!management) {
    throw {
      statusCode: 403,
      message: 'Only owner can update automation configs'
    };
  }

  // Cập nhật configs
  const device = await Device.findByIdAndUpdate(
    deviceId,
    { automation_configs: automationConfigs },
    { new: true, runValidators: true }
  );

  return device;
};

/**
 * Thêm user vào device (share device)
 * @param {String} deviceId - ID của device
 * @param {String} ownerId - ID của owner (người share)
 * @param {String} newUserId - ID của user được share
 * @param {String} role - Role của user mới (member)
 * @returns {Object} New management record
 */
const shareDevice = async (deviceId, ownerId, newUserId, role = 'member') => {
  // Kiểm tra người share có phải owner không
  const ownerManagement = await UserDeviceManagement.findOne({
    device: deviceId,
    user: ownerId,
    role: 'owner'
  });

  if (!ownerManagement) {
    throw {
      statusCode: 403,
      message: 'Only owner can share device'
    };
  }

  // Kiểm tra user mới đã được add chưa
  const existingManagement = await UserDeviceManagement.findOne({
    device: deviceId,
    user: newUserId
  });

  if (existingManagement) {
    throw {
      statusCode: 400,
      message: 'User already has access to this device'
    };
  }

  // Tạo management record mới
  const management = await UserDeviceManagement.create({
    user: newUserId,
    device: deviceId,
    role: role
  });

  return management;
};

/**
 * Xóa user khỏi device
 * @param {String} deviceId - ID của device
 * @param {String} ownerId - ID của owner
 * @param {String} userIdToRemove - ID của user cần xóa
 */
const removeUserFromDevice = async (deviceId, ownerId, userIdToRemove) => {
  // Kiểm tra người xóa có phải owner không
  const ownerManagement = await UserDeviceManagement.findOne({
    device: deviceId,
    user: ownerId,
    role: 'owner'
  });

  if (!ownerManagement) {
    throw {
      statusCode: 403,
      message: 'Only owner can remove users'
    };
  }

  // Không cho phép xóa chính owner
  if (userIdToRemove.toString() === ownerId.toString()) {
    throw {
      statusCode: 400,
      message: 'Cannot remove device owner'
    };
  }

  // Xóa management record
  const result = await UserDeviceManagement.findOneAndDelete({
    device: deviceId,
    user: userIdToRemove
  });

  if (!result) {
    throw {
      statusCode: 404,
      message: 'User not found in device'
    };
  }

  return { message: 'User removed successfully' };
};

/**
 * Lấy danh sách users có quyền truy cập device
 * @param {String} deviceId - ID của device
 * @param {String} userId - ID của user (để kiểm tra quyền)
 * @returns {Array} Danh sách users
 */
const getDeviceUsers = async (deviceId, userId) => {
  // Kiểm tra user có quyền truy cập device này không
  const hasAccess = await UserDeviceManagement.findOne({
    device: deviceId,
    user: userId
  });

  if (!hasAccess) {
    throw {
      statusCode: 403,
      message: 'You do not have access to this device'
    };
  }

  const managements = await UserDeviceManagement.find({ device: deviceId })
    .populate('user', 'username email full_name')
    .sort({ role: -1 }); // owner trước, member sau

  return managements.map(m => ({
    user_id: m.user._id,
    username: m.user.username,
    email: m.user.email,
    full_name: m.user.full_name,
    role: m.role,
    alias_name: m.alias_name,
    joined_at: m.createdAt
  }));
};

/**
 * Cập nhật management settings (alias_name, notifications, alert_settings)
 * @param {String} deviceId - ID của device
 * @param {String} userId - ID của user
 * @param {Object} settings - Settings mới
 * @returns {Object} Updated management
 */
const updateUserDeviceSettings = async (deviceId, userId, settings) => {
  const { alias_name, notifications, alert_settings } = settings;

  const management = await UserDeviceManagement.findOne({
    device: deviceId,
    user: userId
  });

  if (!management) {
    throw {
      statusCode: 404,
      message: 'Device management record not found'
    };
  }

  // Cập nhật settings
  if (alias_name !== undefined) management.alias_name = alias_name;
  if (notifications) management.notifications = { ...management.notifications, ...notifications };
  if (alert_settings) management.alert_settings = { ...management.alert_settings, ...alert_settings };

  await management.save();

  return management;
};

/**
 * Xóa device (chỉ owner)
 * @param {String} deviceId - ID của device
 * @param {String} userId - ID của user
 */
const deleteDevice = async (deviceId, userId) => {
  // Kiểm tra user có phải owner không
  const management = await UserDeviceManagement.findOne({
    device: deviceId,
    user: userId,
    role: 'owner'
  });

  if (!management) {
    throw {
      statusCode: 403,
      message: 'Only owner can delete device'
    };
  }

  // Xóa tất cả management records
  await UserDeviceManagement.deleteMany({ device: deviceId });

  // Xóa device
  await Device.findByIdAndDelete(deviceId);

  return { message: 'Device deleted successfully' };
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
