const UserDeviceManagement = require('../models/UserDeviceManagement');
const housesService = require('./housesService');

/**
 * Alert Service
 * Service để kiểm tra và gửi cảnh báo khi sensor vượt ngưỡng
 */

// Thời gian cooldown giữa các lần alert (15 phút)
const ALERT_COOLDOWN_MS = 15 * 60 * 1000;

/**
 * Kiểm tra xem có cần gửi alert không (dựa trên cooldown)
 * @param {Date} lastAlertTime - Thời gian alert cuối cùng
 * @returns {Boolean}
 */
const shouldSendAlert = (lastAlertTime) => {
  if (!lastAlertTime) return true;
  const timeSinceLastAlert = Date.now() - new Date(lastAlertTime).getTime();
  return timeSinceLastAlert > ALERT_COOLDOWN_MS;
};

/**
 * Kiểm tra ngưỡng nhiệt độ
 * @param {Number} temp - Nhiệt độ hiện tại
 * @param {Object} alertSettings - Ngưỡng cảnh báo
 * @returns {String|null} Message hoặc null
 */
const checkTemperatureThreshold = (temp, alertSettings) => {
  if (temp > alertSettings.max_temp) {
    return `⚠️ High Temperature Alert: ${temp}°C (Max: ${alertSettings.max_temp}°C)`;
  }
  if (temp < alertSettings.min_temp) {
    return `⚠️ Low Temperature Alert: ${temp}°C (Min: ${alertSettings.min_temp}°C)`;
  }
  return null;
};

/**
 * Kiểm tra ngưỡng độ ẩm không khí
 * @param {Number} humidity - Độ ẩm hiện tại
 * @param {Object} alertSettings - Ngưỡng cảnh báo
 * @returns {String|null} Message hoặc null
 */
const checkHumidityThreshold = (humidity, alertSettings) => {
  if (humidity > alertSettings.max_humidity) {
    return `⚠️ High Humidity Alert: ${humidity}% (Max: ${alertSettings.max_humidity}%)`;
  }
  if (humidity < alertSettings.min_humidity) {
    return `⚠️ Low Humidity Alert: ${humidity}% (Min: ${alertSettings.min_humidity}%)`;
  }
  return null;
};

/**
 * Kiểm tra ngưỡng độ ẩm đất
 * @param {Number} soilMoisture - Độ ẩm đất hiện tại
 * @param {Object} alertSettings - Ngưỡng cảnh báo
 * @returns {String|null} Message hoặc null
 */
const checkSoilMoistureThreshold = (soilMoisture, alertSettings) => {
  if (soilMoisture < alertSettings.min_soil_moisture) {
    return `⚠️ Low Soil Moisture Alert: ${soilMoisture}% (Min: ${alertSettings.min_soil_moisture}%)`;
  }
  return null;
};

/**
 * Gửi email alert (placeholder - cần tích hợp email service)
 * @param {String} email - Email người nhận
 * @param {String} deviceName - Tên thiết bị
 * @param {String} message - Nội dung cảnh báo
 */
const sendEmailAlert = async (email, deviceName, message) => {
  // TODO: Tích hợp email service (Nodemailer, SendGrid, etc.)
  console.log(`📧 [EMAIL ALERT] To: ${email}`);
  console.log(`   Device: ${deviceName}`);
  console.log(`   Message: ${message}`);
  console.log(`   Time: ${new Date().toLocaleString()}`);
  
  // Ví dụ tích hợp sau:
  // await emailService.send({
  //   to: email,
  //   subject: `[IoT Alert] ${deviceName}`,
  //   text: message
  // });
};

/**
 * Gửi push notification (placeholder - cần tích hợp push service)
 * @param {String} userId - ID user
 * @param {String} deviceName - Tên thiết bị
 * @param {String} message - Nội dung cảnh báo
 */
const sendPushNotification = async (userId, deviceName, message) => {
  // TODO: Tích hợp push notification service (FCM, OneSignal, etc.)
  console.log(`📱 [PUSH NOTIFICATION] To User: ${userId}`);
  console.log(`   Device: ${deviceName}`);
  console.log(`   Message: ${message}`);
  console.log(`   Time: ${new Date().toLocaleString()}`);
  
  // Ví dụ tích hợp sau:
  // await pushService.send({
  //   userId: userId,
  //   title: `[IoT Alert] ${deviceName}`,
  //   body: message
  // });
};

/**
 * Kiểm tra alerts cho một device cụ thể
 * @param {String} hardwareId - Hardware ID của device
 */
const checkDeviceAlerts = async (hardwareId) => {
  try {
    // Lấy dữ liệu sensor mới nhất từ Houses Server
    const sensorDataResult = await housesService.getLatestSensorData(hardwareId);
    
    if (!sensorDataResult.success || !sensorDataResult.data) {
      console.log(`⚠️ Cannot get sensor data for device: ${hardwareId}`);
      return;
    }

    const sensorData = sensorDataResult.data;
    
    // Tìm device trong DB
    const Device = require('../models/Device');
    const device = await Device.findOne({ hardware_id: hardwareId });
    
    if (!device) {
      console.log(`⚠️ Device not found in DB: ${hardwareId}`);
      return;
    }

    // Lấy tất cả users có quyền truy cập device này
    const managements = await UserDeviceManagement.find({ device: device._id })
      .populate('user', 'username email');

    if (!managements || managements.length === 0) {
      return; // Không có user nào theo dõi device này
    }

    // Kiểm tra alerts cho từng user
    for (const management of managements) {
      const { alert_settings, last_alert_sent, notifications } = management;
      const user = management.user;
      const deviceName = management.alias_name || device.name;

      let alertsToSend = [];
      let updatedLastAlertSent = { ...last_alert_sent };

      // Kiểm tra nhiệt độ
      if (sensorData.temp !== undefined && shouldSendAlert(last_alert_sent.temp)) {
        const tempAlert = checkTemperatureThreshold(sensorData.temp, alert_settings);
        if (tempAlert) {
          alertsToSend.push(tempAlert);
          updatedLastAlertSent.temp = new Date();
        }
      }

      // Kiểm tra độ ẩm không khí
      if (sensorData.humidity !== undefined && shouldSendAlert(last_alert_sent.humidity)) {
        const humidityAlert = checkHumidityThreshold(sensorData.humidity, alert_settings);
        if (humidityAlert) {
          alertsToSend.push(humidityAlert);
          updatedLastAlertSent.humidity = new Date();
        }
      }

      // Kiểm tra độ ẩm đất
      if (sensorData.soil_moisture !== undefined && shouldSendAlert(last_alert_sent.soil)) {
        const soilAlert = checkSoilMoistureThreshold(sensorData.soil_moisture, alert_settings);
        if (soilAlert) {
          alertsToSend.push(soilAlert);
          updatedLastAlertSent.soil = new Date();
        }
      }

      // Gửi alerts nếu có
      if (alertsToSend.length > 0) {
        const alertMessage = alertsToSend.join('\n');

        // Gửi email nếu được bật
        if (notifications.enable_email && user.email) {
          await sendEmailAlert(user.email, deviceName, alertMessage);
        }

        // Gửi push notification nếu được bật
        if (notifications.enable_push) {
          await sendPushNotification(user._id, deviceName, alertMessage);
        }

        // Cập nhật last_alert_sent
        management.last_alert_sent = updatedLastAlertSent;
        await management.save();
      }
    }
  } catch (error) {
    console.error(`❌ Error checking alerts for device ${hardwareId}:`, error.message);
  }
};

/**
 * Kiểm tra alerts cho tất cả devices
 */
const checkAllDeviceAlerts = async () => {
  try {
    console.log('🔍 Starting alert check for all devices...');
    
    const Device = require('../models/Device');
    const devices = await Device.find({});

    console.log(`   Found ${devices.length} device(s) to check`);

    for (const device of devices) {
      await checkDeviceAlerts(device.hardware_id);
    }

    console.log('✅ Alert check completed');
  } catch (error) {
    console.error('❌ Error in checkAllDeviceAlerts:', error.message);
  }
};

module.exports = {
  checkDeviceAlerts,
  checkAllDeviceAlerts,
  sendEmailAlert,
  sendPushNotification
};
