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

  // Cấu hình tự động - Chỉ owner mới có quyền thay đổi
  automation_configs: {
    auto_pump: {
      enabled: { type: Boolean, default: true },
      threshold_moisture: { type: Number, default: 40 }, // Đất khô < 40% thì bơm
      duration_seconds: { type: Number, default: 30 },    // Bơm trong 30s
      schedules: [
        {
          enabled: { type: Boolean, default: false },

          // Loại lịch
          type: {
            type: String,
            enum: ['daily', 'weekly'],
            default: 'daily'
          },

          // Thời điểm chạy (theo local time user)
          time: {
            hour: { type: Number, min: 0, max: 23, required: true },
            minute: { type: Number, min: 0, max: 59, default: 0 }
          },

          // Dùng cho weekly
          days_of_week: {
            type: [Number], // 0 = CN, 1 = T2 ... 6 = T7
            default: []
          },

          // Cấu hình riêng cho lần bơm này
          duration_seconds: { type: Number, default: 20 },

          last_executed_at: { type: Date }
        }
      ]
    }
  }
}, {
  timestamps: true // Tự động tạo createdAt, updatedAt
});

module.exports = mongoose.model('Device', deviceSchema);
