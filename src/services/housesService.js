const axios = require('axios');
const config = require('../config');

/**
 * Houses Service
 * Service layer để giao tiếp với Houses_server
 * Tất cả các API call đến Houses_server đều được tập trung tại đây
 */

// Tạo axios instance với cấu hình mặc định
const housesAPI = axios.create({
  baseURL: config.HOUSES_SERVER_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.HOUSES_SERVER_API_KEY, // API Key để xác thực giữa 2 servers
  },
});

// Interceptor để log requests (cho development)
housesAPI.interceptors.request.use(
  (config) => {
    console.log(`→ Houses Server Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và errors
housesAPI.interceptors.response.use(
  (response) => {
    console.log(`✓ Houses Server Response: ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`✗ Houses Server Error:`, error.message);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

/**
 * Lấy dữ liệu cảm biến mới nhất (real-time)
 * GET /api/internal/latest
 */
const getLatestSensorData = async () => {
  try {
    const response = await housesAPI.get('/latest');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch latest sensor data',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Lấy lịch sử dữ liệu cảm biến
 * GET /api/internal/history
 * @param {Object} params - Query parameters (startDate, endDate, type)
 */
const getSensorHistory = async (params) => {
  try {
    const response = await housesAPI.get('/history', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch sensor history',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Gửi lệnh điều khiển thiết bị
 * POST /api/internal/command
 * @param {String} deviceId - ID của thiết bị (PUMP, LIGHT, etc.)
 * @param {String} action - Hành động (ON, OFF)
 */
const sendDeviceCommand = async (deviceId, action) => {
  try {
    const response = await housesAPI.post('/command', {
      deviceId,
      action,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to send device command',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Lấy trạng thái tất cả thiết bị
 * GET /api/internal/devices/status
 */
const getDevicesStatus = async () => {
  try {
    const response = await housesAPI.get('/devices/status');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    throw {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch devices status',
      statusCode: error.response?.status || 500,
    };
  }
};

/**
 * Health check - Kiểm tra Houses Server có hoạt động không
 * GET /api/internal/health
 */
const checkHealth = async () => {
  try {
    const response = await housesAPI.get('/health');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Houses Server is not available',
    };
  }
};

module.exports = {
  getLatestSensorData,
  getSensorHistory,
  sendDeviceCommand,
  getDevicesStatus,
  checkHealth,
};
