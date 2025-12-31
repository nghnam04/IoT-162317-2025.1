const cron = require('node-cron');
const alertService = require('./alertService');

/**
 * Cron Job Service
 * Service để quản lý các scheduled tasks
 */

let alertCheckJob = null;

/**
 * Khởi tạo alert monitoring cron job
 * Chạy mỗi 5 phút để kiểm tra ngưỡng cảnh báo
 */
const startAlertMonitoring = () => {
  if (alertCheckJob) {
    console.log('⚠️ Alert monitoring job is already running');
    return;
  }

  // Cron pattern: Mỗi 5 phút
  // Format: */5 * * * * (second minute hour day month weekday)
  alertCheckJob = cron.schedule('*/5 * * * *', async () => {
    console.log('\n⏰ [CRON] Alert check triggered at:', new Date().toLocaleString());
    await alertService.checkAllDeviceAlerts();
  });

  console.log('✅ Alert monitoring cron job started (runs every 5 minutes)');
};

/**
 * Dừng alert monitoring cron job
 */
const stopAlertMonitoring = () => {
  if (alertCheckJob) {
    alertCheckJob.stop();
    alertCheckJob = null;
    console.log('⏹️ Alert monitoring cron job stopped');
  }
};

/**
 * Kiểm tra trạng thái cron job
 * @returns {Boolean}
 */
const isAlertMonitoringRunning = () => {
  return alertCheckJob !== null;
};

/**
 * Khởi tạo tất cả cron jobs
 */
const initializeCronJobs = () => {
  console.log('🚀 Initializing cron jobs...');
  startAlertMonitoring();
  
  // TODO: Có thể thêm các cron jobs khác ở đây
  // Ví dụ:
  // - Auto pump scheduling
  // - Data cleanup
  // - Report generation
};

/**
 * Dừng tất cả cron jobs
 */
const stopAllCronJobs = () => {
  console.log('🛑 Stopping all cron jobs...');
  stopAlertMonitoring();
};

module.exports = {
  initializeCronJobs,
  stopAllCronJobs,
  startAlertMonitoring,
  stopAlertMonitoring,
  isAlertMonitoringRunning
};
