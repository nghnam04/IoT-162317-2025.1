const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  // Định danh phần cứng (Không thay đổi)
  hardware_id: {
    type: String,
    required: [true, 'Hardware ID is required'],
    unique: true, // Mỗi thiết bị chỉ có 1 ID duy nhất trên toàn hệ thống
    trim: true
  },
  
  // Tên mặc định của thiết bị (User có thể đặt alias khác ở bảng management)
  name: {
    type: String,
    default: "Smart Garden Device"
  },

  // Loại thiết bị (Sau này mở rộng thêm loại khác ngoài vườn)
  type: {
    type: String,
    default: 'Sensor'
  },

  // Trạng thái pump hiện tại (ON, OFF, AUTO)
  // Được cập nhật từ Houses_server
  pump_mode: {
    type: String,
    enum: ['ON', 'OFF', 'AUTO'],
    default: 'OFF'
  }
}, {
  timestamps: true // Tự động tạo createdAt, updatedAt
});

module.exports = mongoose.model('Device', deviceSchema);
