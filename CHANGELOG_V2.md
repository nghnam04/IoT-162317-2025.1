# Tóm tắt các thay đổi trong hệ thống v2.0

## 📋 Tổng quan
Đã thực hiện các thay đổi lớn để nâng cấp hệ thống từ single-device sang multi-device với device sharing và alert monitoring tự động.

---

## 🗄️ Database Schema Changes

### ✅ Models Mới

#### 1. **Device.js** (MỚI)
- Lưu trữ thông tin phần cứng và cấu hình
- `hardware_id`: ID duy nhất của thiết bị
- `automation_configs`: Cấu hình tự động (auto pump, schedules)
- Hỗ trợ scheduling (daily/weekly)

#### 2. **UserDeviceManagement.js** (MỚI)
- Quản lý quyền truy cập device
- Vai trò: `owner` hoặc `member`
- Settings cá nhân: `alias_name`, `notifications`, `alert_settings`
- Tracking: `last_alert_sent` để tránh spam

### ❌ Models Đã Xóa
- **UserConfig.js** - Thay thế bởi UserDeviceManagement

### ✓ Models Giữ Nguyên
- **User.js** - Không thay đổi

---

## 🔧 Backend Changes

### Services Mới

#### 1. **deviceService.js**
Các functions:
- `createDevice()` - Tạo device và gán owner
- `getUserDevices()` - Lấy danh sách devices của user
- `getDeviceDetail()` - Chi tiết device
- `updateAutomationConfigs()` - Cập nhật automation (owner only)
- `shareDevice()` - Chia sẻ device với user khác
- `removeUserFromDevice()` - Xóa user khỏi device
- `getDeviceUsers()` - Danh sách users có quyền truy cập
- `updateUserDeviceSettings()` - Cập nhật settings cá nhân
- `deleteDevice()` - Xóa device (owner only)

#### 2. **alertService.js**
Xử lý cảnh báo tự động:
- Kiểm tra sensor data với alert thresholds
- Cooldown 15 phút giữa các lần alert
- Hỗ trợ email và push notifications
- Functions:
  - `checkDeviceAlerts()` - Kiểm tra alerts cho 1 device
  - `checkAllDeviceAlerts()` - Kiểm tra tất cả devices
  - `sendEmailAlert()` - Gửi email (placeholder)
  - `sendPushNotification()` - Gửi push (placeholder)

#### 3. **cronService.js**
Quản lý Cron Jobs:
- Alert monitoring: Chạy mỗi 5 phút
- `initializeCronJobs()` - Khởi tạo tất cả jobs
- `stopAllCronJobs()` - Dừng khi server shutdown
- Graceful shutdown support

### Controllers Mới

#### 1. **deviceController.js**
Xử lý tất cả API requests liên quan đến devices:
- CRUD operations
- Sharing & permissions
- Settings management

### Controllers Đã Cập Nhật

#### 1. **controlController.js**
- Thay đổi route: `/control/device/:deviceId` (thay vì body param)
- Kiểm tra quyền truy cập device
- Lấy `hardware_id` từ Device model

#### 2. **monitorController.js**
- Thay đổi routes: `/monitor/:deviceId/current` và `/monitor/:deviceId/history`
- Kiểm tra quyền truy cập device
- Lấy `hardware_id` từ Device model

### Routes Mới

#### **deviceRoutes.js**
```
POST   /api/v1/devices                           - Tạo device
GET    /api/v1/devices                           - Danh sách devices
GET    /api/v1/devices/:deviceId                 - Chi tiết device
PUT    /api/v1/devices/:deviceId/automation      - Cập nhật automation (owner)
POST   /api/v1/devices/:deviceId/share           - Share device (owner)
DELETE /api/v1/devices/:deviceId/users/:userId   - Xóa user (owner)
GET    /api/v1/devices/:deviceId/users           - Danh sách users
PUT    /api/v1/devices/:deviceId/settings        - Cập nhật settings cá nhân
DELETE /api/v1/devices/:deviceId                 - Xóa device (owner)
```

### Routes Đã Cập Nhật

#### **controlRoutes.js**
- `POST /control/device/:deviceId` - Thêm deviceId param

#### **monitorRoutes.js**
- `GET /monitor/:deviceId/current` - Thêm deviceId param
- `GET /monitor/:deviceId/history` - Thêm deviceId param

---

## 🔄 App.js Changes

### Cron Job Integration
```javascript
// Khởi động cron jobs khi server start
cronService.initializeCronJobs();

// Graceful shutdown
process.on('SIGTERM', () => {
  cronService.stopAllCronJobs();
});
```

---

## 📦 Dependencies Mới

### Package.json
```json
{
  "node-cron": "^3.x.x"
}
```

Cài đặt:
```bash
npm install node-cron
```

---

## 📚 Documentation Updates

### 1. **API_DOCUMENTATION_V2.md** (MỚI)
- Tài liệu API đầy đủ cho v2.0
- Hướng dẫn sử dụng các tính năng mới
- Quick start guide
- Data models schema

### 2. **swagger.js**
- Cập nhật version 2.0.0
- Thêm Device & UserDeviceManagement schemas
- Cập nhật SensorData schema
- Cập nhật API tags

---

## 🎯 Tính năng chính

### 1. Multi-Device Support
- 1 user có thể quản lý nhiều devices
- Mỗi device có settings riêng

### 2. Device Sharing
- Owner có thể chia sẻ device với users khác
- Roles: owner (full access) vs member (read + control)

### 3. Personal Alert Settings
- Mỗi user có ngưỡng cảnh báo riêng cho cùng 1 device
- Ví dụ: User A báo ở 35°C, User B báo ở 40°C

### 4. Automation Scheduling
- Lịch tự động bơm (daily/weekly)
- Cấu hình linh hoạt cho mỗi schedule

### 5. Alert Monitoring System
- Cron job kiểm tra mỗi 5 phút
- Cooldown 15 phút tránh spam
- Email + Push notification (placeholder)
- Track `last_alert_sent` cho mỗi loại alert

---

## 🔒 Security & Permissions

### Owner Permissions
- Cập nhật automation configs
- Share device với users khác
- Xóa users khỏi device
- Xóa device

### Member Permissions
- Xem dữ liệu sensor
- Điều khiển device (pump)
- Cập nhật settings cá nhân

### Authentication
- Tất cả APIs (trừ auth) yêu cầu JWT token
- Mỗi request kiểm tra quyền truy cập device

---

## 🚀 Migration Guide

### Bước 1: Update Database
```javascript
// Các bản ghi UserConfig cũ có thể migrate sang UserDeviceManagement
// Hoặc xóa đi và tạo lại devices mới
```

### Bước 2: Tạo Devices
```bash
POST /api/v1/devices
{
  "hardware_id": "esp32-27",
  "name": "My Smart Garden"
}
```

### Bước 3: Cấu hình Alert Settings
```bash
PUT /api/v1/devices/{deviceId}/settings
{
  "alert_settings": {
    "max_temp": 35,
    "min_soil_moisture": 20
  },
  "notifications": {
    "enable_email": true
  }
}
```

### Bước 4: Test Alert System
- Cron job tự động chạy sau khi start server
- Kiểm tra console logs để xem alerts

---

## 📝 TODO - Tích hợp sau

### Email Service
```javascript
// alertService.js - sendEmailAlert()
// Tích hợp Nodemailer hoặc SendGrid
```

### Push Notification Service
```javascript
// alertService.js - sendPushNotification()
// Tích hợp Firebase Cloud Messaging hoặc OneSignal
```

### Automation Execution
- Cron job để execute scheduled pumping
- Check schedules và trigger pump commands

### Advanced Features
- Dashboard với charts
- Device statistics
- Alert history
- Automation logs

---

## 🐛 Testing Checklist

### API Endpoints
- [x] Create device
- [x] Get user devices
- [x] Get device detail
- [x] Update automation configs
- [x] Share device
- [x] Remove user from device
- [x] Get device users
- [x] Update user device settings
- [x] Delete device
- [x] Control device (with deviceId)
- [x] Get current sensor data (with deviceId)
- [x] Get sensor history (with deviceId)

### Cron Jobs
- [x] Alert monitoring starts automatically
- [x] Graceful shutdown on SIGTERM/SIGINT
- [ ] Test alert cooldown
- [ ] Test email notifications (khi tích hợp)
- [ ] Test push notifications (khi tích hợp)

### Permissions
- [ ] Owner can update automation
- [ ] Member cannot update automation
- [ ] Owner can share device
- [ ] Member cannot share device
- [ ] Owner can delete device
- [ ] Member cannot delete device

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Console logs cho cron job output
2. Database connections
3. JWT tokens còn valid
4. Device permissions đã set đúng

## 🎉 Hoàn thành!

Hệ thống v2.0 đã sẵn sàng với:
- ✅ Multi-device support
- ✅ Device sharing
- ✅ Personal alert settings
- ✅ Automation scheduling
- ✅ Alert monitoring cron job
- ✅ Updated API documentation
- ✅ Updated Swagger docs
