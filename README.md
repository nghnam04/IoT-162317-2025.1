# UI Backend - IoT Project v2.0

Backend server cho hệ thống IoT, đóng vai trò là Gateway giữa Client (Web/Mobile) và Houses Server.

## 🎉 Tính năng mới trong v2.0

### ✨ Multi-Device Support
- ✅ Quản lý nhiều thiết bị IoT
- ✅ Device sharing (Owner/Member roles)
- ✅ Personal settings cho mỗi device

### 🔔 Alert Monitoring System
- ✅ Cron job kiểm tra mỗi 5 phút
- ✅ Alert thresholds cá nhân hóa
- ✅ Cooldown 15 phút tránh spam
- 📧 Email notifications (placeholder)
- 📱 Push notifications (placeholder)

### ⚙️ Automation
- ✅ Auto pump based on soil moisture
- ✅ Scheduling (daily/weekly)
- ✅ Owner-only configuration

## 📚 Tài liệu

- **Quick Start**: [QUICK_START.md](./QUICK_START.md)
- **API Documentation**: [API_DOCUMENTATION_V2.md](./API_DOCUMENTATION_V2.md)
- **Changelog**: [CHANGELOG_V2.md](./CHANGELOG_V2.md)
- **Swagger UI**: http://localhost:5000/api-docs

## 🚀 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Copy file .env
cp .env.example .env

# Chỉnh sửa các biến môi trường trong .env

# Chạy server (development)
npm run dev

# Chạy server (production)
npm start
```

## 📋 Cấu trúc API v2.0

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

### Device Management (MỚI)
- `POST /api/v1/devices` - Tạo device mới
- `GET /api/v1/devices` - Danh sách devices của user
- `GET /api/v1/devices/:deviceId` - Chi tiết device
- `PUT /api/v1/devices/:deviceId/automation` - Cập nhật automation (Owner)
- `POST /api/v1/devices/:deviceId/share` - Share device (Owner)
- `GET /api/v1/devices/:deviceId/users` - Danh sách users
- `PUT /api/v1/devices/:deviceId/settings` - Cập nhật settings
- `DELETE /api/v1/devices/:deviceId` - Xóa device (Owner)

### Monitoring
- `GET /api/v1/monitor/:deviceId/current` - Dữ liệu real-time
- `GET /api/v1/monitor/:deviceId/history` - Lịch sử dữ liệu

### Control
- `POST /api/v1/control/device/:deviceId` - Điều khiển thiết bị

### Settings (Deprecated - Dùng Device Settings)
- `GET /api/v1/settings` - Lấy cấu hình (legacy)
- `PUT /api/v1/settings` - Cập nhật cấu hình (legacy)

## ⚙️ Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iot_project
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
HOUSES_SERVER_URL=http://localhost:3000/api
```

## 🏗️ Kiến trúc Hệ thống

```
Client (Web/Mobile)
    ↓
UI Backend (Port 5000)
    ↓
Houses Server (Port 3000)
    ↓
ESP32 Devices
```

### Components:
- **Models**: Device, UserDeviceManagement, User
- **Services**: deviceService, alertService, cronService, housesService, authService
- **Controllers**: deviceController, controlController, monitorController, authController
- **Cron Jobs**: Alert monitoring (every 5 minutes)

## 📊 Database Schema

### Device
- hardware_id (unique)
- name, type
- automation_configs (auto_pump, schedules)

### UserDeviceManagement
- user (ref: User)
- device (ref: Device)
- role (owner/member)
- alias_name
- notifications
- alert_settings
- last_alert_sent

### User
- username, email, password
- full_name, role

## 🎯 Quick Start Example

```bash
# 1. Register
POST http://localhost:5000/api/v1/auth/register
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}

# 2. Create Device
POST http://localhost:5000/api/v1/devices
Authorization: Bearer <token>
{
  "hardware_id": "esp32-27",
  "name": "My Garden"
}

# 3. Configure Alerts
PUT http://localhost:5000/api/v1/devices/{deviceId}/settings
{
  "alert_settings": {
    "max_temp": 35,
    "min_soil_moisture": 25
  },
  "notifications": {
    "enable_email": true
  }
}
```

## 🔧 Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- Houses Server phải đang chạy tại địa chỉ cấu hình trong HOUSES_SERVER_URL
