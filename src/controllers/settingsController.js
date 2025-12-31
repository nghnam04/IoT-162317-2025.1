/**
 * Settings Controller
 * DEPRECATED: API này đã bị thay thế bởi /api/v1/devices/:deviceId/settings
 * Giữ lại để backward compatibility với client cũ
 */

/**
 * @route   GET /api/v1/settings
 * @desc    Lấy cấu hình của user hiện tại (DEPRECATED)
 * @access  Private
 * @deprecated Use /api/v1/devices/:deviceId/settings instead
 */
const getSettings = async (req, res, next) => {
  try {
    // API này đã deprecated - hướng dẫn user sử dụng API mới
    res.status(410).json({
      success: false,
      message: 'This endpoint is deprecated. Please use /api/v1/devices API instead.',
      migration: {
        step1: 'GET /api/v1/devices - Get list of your devices',
        step2: 'GET /api/v1/devices/:deviceId - Get device details with settings',
        step3: 'PUT /api/v1/devices/:deviceId/settings - Update device settings'
      },
      documentation: 'See API_DOCUMENTATION_V2.md for details'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/v1/settings
 * @desc    Cập nhật cấu hình của user (DEPRECATED)
 * @body    { sensor_id, notifications: {...}, thresholds: {...} }
 * @access  Private
 * @deprecated Use /api/v1/devices/:deviceId/settings instead
 */
const updateSettings = async (req, res, next) => {
  try {
    // API này đã deprecated - hướng dẫn user sử dụng API mới
    res.status(410).json({
      success: false,
      message: 'This endpoint is deprecated. Please use /api/v1/devices API instead.',
      migration: {
        step1: 'POST /api/v1/devices - Create device with hardware_id',
        step2: 'PUT /api/v1/devices/:deviceId/settings - Update settings (notifications, alert_settings)',
        example: {
          url: 'PUT /api/v1/devices/:deviceId/settings',
          body: {
            alias_name: 'My Garden',
            notifications: {
              enable_email: true,
              enable_push: false
            },
            alert_settings: {
              max_temp: 35,
              min_temp: 15,
              min_soil_moisture: 20
            }
          }
        }
      },
      documentation: 'See API_DOCUMENTATION_V2.md for details'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
