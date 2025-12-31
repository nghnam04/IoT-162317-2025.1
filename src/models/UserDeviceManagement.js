const mongoose = require('mongoose');

const userDeviceManagementSchema = new mongoose.Schema({
  // Liên kết: User nào?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Liên kết: Thiết bị nào?
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },

  // Vai trò của User đối với thiết bị này
  role: {
    type: String,
    enum: ['owner', 'member'], 
    default: 'owner',
    required: true
  },

  // Tên gợi nhớ riêng (Ví dụ: Chồng đặt là "Vườn rau", Vợ đặt là "Cây cảnh")
  alias_name: {
    type: String,
    trim: true
  },

  notifications: {
    enable_email: { type: Boolean, default: true },
    enable_push: { type: Boolean, default: false }
  },

  // Ngưỡng CẢNH BÁO riêng (Alert Thresholds)
  // User A thích 35 độ báo, User B thích 40 độ báo -> Lưu ở đây
  alert_settings: {
    max_temp: { type: Number, default: 35 },
    min_temp: { type: Number, default: 15 },
    min_humidity: { type: Number, default: 40 },
    max_humidity: { type: Number, default: 80 },
    min_soil_moisture: { type: Number, default: 20 }, // Cảnh báo khi đất khô
    min_light: { type: Number, default: 200 }
  },

  last_alert_sent: {
    temp: { type: Date, default: null },       // Lần cuối báo nhiệt độ
    humidity: { type: Date, default: null },   // Lần cuối báo độ ẩm
    soil: { type: Date, default: null }        // Lần cuối báo đất
  }

}, {
  timestamps: true
});

// Đảm bảo 1 User không thể được add 2 lần vào cùng 1 Device
userDeviceManagementSchema.index({ user: 1, device: 1 }, { unique: true });

module.exports = mongoose.model('UserDeviceManagement', userDeviceManagementSchema);
