# API Documentation - UI Backend v2.0

## 📝 Tổng quan

Backend Gateway kết nối giữa Client (Web/Mobile) và Houses Server, cung cấp các API cho:
- **Authentication & User Management** - Đăng ký, đăng nhập, quản lý người dùng
- **Device Management** - Quản lý thiết bị, chia sẻ thiết bị, cấu hình automation
- **Real-time Sensor Monitoring** - Theo dõi dữ liệu sensor real-time và lịch sử
- **Device Control** - Điều khiển thiết bị (bật/tắt máy bơm, v.v.)
- **Alert Monitoring** - Cảnh báo tự động khi sensor vượt ngưỡng

## 🔄 Thay đổi lớn trong v2.0

### Schema mới:
1. **Device**: Lưu thông tin phần cứng và automation configs
2. **UserDeviceManagement**: Quản lý quyền truy cập device và settings cá nhân
3. **Xóa UserConfig**: Thay thế bằng UserDeviceManagement

### Tính năng mới:
- Multi-device support (1 user nhiều devices)
- Device sharing (owner có thể chia sẻ device với member)
- Personal alert settings (mỗi user có ngưỡng cảnh báo riêng)
- Automation scheduling (lịch tự động bơm)
- Alert monitoring với Cron Job (kiểm tra mỗi 5 phút)

## 🌐 Base URLs

**Development:**
```
http://localhost:5000/api/v1
```

**Swagger UI:**
```
http://localhost:5000/api-docs
```

## 🔐 Authentication

Tất cả các API (trừ `/auth/register` và `/auth/login`) yêu cầu JWT Token trong header:

```http
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### 1. Authentication APIs

#### 1.1. Đăng ký tài khoản mới
```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "username": "nguyenvana",
  "email": "a@gmail.com",
  "password": "123456",
  "full_name": "Nguyen Van A"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user",
      "created_at": "2025-12-29T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 1.2. Đăng nhập
```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "identifier": "nguyenvana",
  "password": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Device Management APIs

#### 2.1. Tạo device mới
```http
POST /api/v1/devices
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "hardware_id": "esp32-27",
  "name": "Smart Garden Device",
  "type": "Sensor"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Device created successfully",
  "data": {
    "device": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "hardware_id": "esp32-27",
      "name": "Smart Garden Device",
      "type": "Sensor",
      "automation_configs": {
        "auto_pump": {
          "enabled": true,
          "threshold_moisture": 40,
          "duration_seconds": 30,
          "schedules": []
        }
      },
      "createdAt": "2025-12-31T10:00:00.000Z"
    },
    "management": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "user": "507f1f77bcf86cd799439011",
      "device": "65a1b2c3d4e5f6g7h8i9j0k1",
      "role": "owner"
    }
  }
}
```

---

#### 2.2. Lấy danh sách devices của user
```http
GET /api/v1/devices
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "management_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "device_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "hardware_id": "esp32-27",
      "name": "Smart Garden Device",
      "type": "Sensor",
      "alias_name": "Vườn rau nhà tôi",
      "role": "owner",
      "created_at": "2025-12-31T10:00:00.000Z"
    },
    {
      "management_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "device_id": "65a1b2c3d4e5f6g7h8i9j0k4",
      "hardware_id": "esp32-28",
      "name": "Smart Garden Device",
      "type": "Sensor",
      "alias_name": null,
      "role": "member",
      "created_at": "2025-12-30T08:00:00.000Z"
    }
  ]
}
```

---

#### 2.3. Lấy thông tin chi tiết device
```http
GET /api/v1/devices/:deviceId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "device": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "hardware_id": "esp32-27",
      "name": "Smart Garden Device",
      "type": "Sensor",
      "automation_configs": {
        "auto_pump": {
          "enabled": true,
          "threshold_moisture": 40,
          "duration_seconds": 30,
          "schedules": [
            {
              "enabled": true,
              "type": "daily",
              "time": { "hour": 6, "minute": 0 },
              "duration_seconds": 20
            }
          ]
        }
      }
    },
    "management": {
      "role": "owner",
      "alias_name": "Vườn rau nhà tôi",
      "notifications": {
        "enable_email": true,
        "enable_push": false
      },
      "alert_settings": {
        "max_temp": 35,
        "min_temp": 15,
        "min_humidity": 40,
        "max_humidity": 80,
        "min_soil_moisture": 20,
        "min_light": 200
      }
    }
  }
}
```

---

#### 2.4. Cập nhật automation configs (Owner only)
```http
PUT /api/v1/devices/:deviceId/automation
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "automation_configs": {
    "auto_pump": {
      "enabled": true,
      "threshold_moisture": 35,
      "duration_seconds": 25,
      "schedules": [
        {
          "enabled": true,
          "type": "daily",
          "time": { "hour": 6, "minute": 0 },
          "duration_seconds": 20
        },
        {
          "enabled": true,
          "type": "weekly",
          "time": { "hour": 18, "minute": 30 },
          "days_of_week": [1, 3, 5],
          "duration_seconds": 30
        }
      ]
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Automation configs updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "hardware_id": "esp32-27",
    "automation_configs": { "..." }
  }
}
```

---

#### 2.5. Share device với user khác (Owner only)
```http
POST /api/v1/devices/:deviceId/share
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "user_id": "507f1f77bcf86cd799439012",
  "role": "member"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Device shared successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k5",
    "user": "507f1f77bcf86cd799439012",
    "device": "65a1b2c3d4e5f6g7h8i9j0k1",
    "role": "member"
  }
}
```

---

#### 2.6. Xóa user khỏi device (Owner only)
```http
DELETE /api/v1/devices/:deviceId/users/:userId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User removed successfully"
}
```

---

#### 2.7. Lấy danh sách users có quyền truy cập device
```http
GET /api/v1/devices/:deviceId/users
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "user_id": "507f1f77bcf86cd799439011",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "owner",
      "alias_name": "Vườn rau nhà tôi",
      "joined_at": "2025-12-31T10:00:00.000Z"
    },
    {
      "user_id": "507f1f77bcf86cd799439012",
      "username": "tranvanb",
      "email": "b@gmail.com",
      "full_name": "Tran Van B",
      "role": "member",
      "alias_name": "Vườn của anh A",
      "joined_at": "2025-12-31T11:00:00.000Z"
    }
  ]
}
```

---

#### 2.8. Cập nhật settings cá nhân cho device
```http
PUT /api/v1/devices/:deviceId/settings
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "alias_name": "Vườn rau của tôi",
  "notifications": {
    "enable_email": true,
    "enable_push": true
  },
  "alert_settings": {
    "max_temp": 38,
    "min_temp": 12,
    "min_soil_moisture": 25
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "alias_name": "Vườn rau của tôi",
    "notifications": {
      "enable_email": true,
      "enable_push": true
    },
    "alert_settings": {
      "max_temp": 38,
      "min_temp": 12,
      "min_humidity": 40,
      "max_humidity": 80,
      "min_soil_moisture": 25,
      "min_light": 200
    }
  }
}
```

---

#### 2.9. Xóa device (Owner only)
```http
DELETE /api/v1/devices/:deviceId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Device deleted successfully"
}
```

---

### 3. Monitoring APIs

#### 3.1. Lấy dữ liệu sensor hiện tại (real-time)
```http
GET /api/v1/monitor/:deviceId/current
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Latest sensor data retrieved successfully",
  "data": {
    "sensorId": "esp32-27",
    "temp": 28.5,
    "humidity": 65,
    "light": 450,
    "soil_moisture": 45,
    "pump_status": "OFF",
    "timestamp": "2025-12-31T15:30:00.000Z"
  }
}
```

---

#### 3.2. Lấy lịch sử dữ liệu sensor
```http
GET /api/v1/monitor/:deviceId/history?from=2025-12-30T00:00:00Z&to=2025-12-31T23:59:59Z
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `from` (required): Thời gian bắt đầu (ISO 8601 format)
- `to` (required): Thời gian kết thúc (ISO 8601 format)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Sensor history retrieved successfully",
  "data": [
    {
      "sensorId": "esp32-27",
      "temp": 28.5,
      "humidity": 65,
      "light": 450,
      "soil_moisture": 45,
      "timestamp": "2025-12-31T15:30:00.000Z"
    },
    {
      "sensorId": "esp32-27",
      "temp": 29.0,
      "humidity": 63,
      "light": 480,
      "soil_moisture": 43,
      "timestamp": "2025-12-31T15:25:00.000Z"
    }
  ]
}
```

---

### 4. Control APIs

#### 4.1. Điều khiển thiết bị (Bật/Tắt máy bơm)
```http
POST /api/v1/control/device/:deviceId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "pump": "ON"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Pump is being turned ON",
  "data": {
    "message": "Command sent successfully"
  }
}
```

---

## 🔔 Alert Monitoring System

### Cách hoạt động:
1. **Cron Job** chạy mỗi 5 phút
2. Lấy dữ liệu sensor mới nhất từ Houses Server
3. Kiểm tra với alert_settings của từng user
4. Gửi email/push notification nếu vượt ngưỡng
5. Cooldown 15 phút giữa các lần alert

### Alert Settings:
- `max_temp`: Nhiệt độ tối đa (mặc định: 35°C)
- `min_temp`: Nhiệt độ tối thiểu (mặc định: 15°C)
- `max_humidity`: Độ ẩm không khí tối đa (mặc định: 80%)
- `min_humidity`: Độ ẩm không khí tối thiểu (mặc định: 40%)
- `min_soil_moisture`: Độ ẩm đất tối thiểu (mặc định: 20%)
- `min_light`: Ánh sáng tối thiểu (mặc định: 200 lux)

### Notifications:
- **Email Alert**: Gửi qua email (cần cấu hình email service)
- **Push Notification**: Gửi qua mobile app (cần cấu hình push service)

---

## 📊 Data Models

### User Schema
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  full_name: String,
  role: "user" | "admin",
  created_at: Date
}
```

### Device Schema
```javascript
{
  hardware_id: String (unique),
  name: String,
  type: String,
  automation_configs: {
    auto_pump: {
      enabled: Boolean,
      threshold_moisture: Number,
      duration_seconds: Number,
      schedules: [
        {
          enabled: Boolean,
          type: "daily" | "weekly",
          time: { hour, minute },
          days_of_week: [Number],
          duration_seconds: Number,
          last_executed_at: Date
        }
      ]
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### UserDeviceManagement Schema
```javascript
{
  user: ObjectId (ref: User),
  device: ObjectId (ref: Device),
  role: "owner" | "member",
  alias_name: String,
  notifications: {
    enable_email: Boolean,
    enable_push: Boolean
  },
  alert_settings: {
    max_temp: Number,
    min_temp: Number,
    min_humidity: Number,
    max_humidity: Number,
    min_soil_moisture: Number,
    min_light: Number
  },
  last_alert_sent: {
    temp: Date,
    humidity: Date,
    soil: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Quick Start Guide

### 1. Đăng ký và đăng nhập
```bash
# Register
POST /api/v1/auth/register
{
  "username": "john",
  "email": "john@example.com",
  "password": "123456"
}

# Login
POST /api/v1/auth/login
{
  "identifier": "john",
  "password": "123456"
}
```

### 2. Tạo device mới
```bash
POST /api/v1/devices
Authorization: Bearer <token>
{
  "hardware_id": "esp32-27",
  "name": "My Garden"
}
```

### 3. Lấy dữ liệu sensor
```bash
GET /api/v1/monitor/{deviceId}/current
Authorization: Bearer <token>
```

### 4. Điều khiển máy bơm
```bash
POST /api/v1/control/device/{deviceId}
Authorization: Bearer <token>
{
  "pump": "ON"
}
```

### 5. Cấu hình alert
```bash
PUT /api/v1/devices/{deviceId}/settings
Authorization: Bearer <token>
{
  "alert_settings": {
    "max_temp": 38,
    "min_soil_moisture": 25
  },
  "notifications": {
    "enable_email": true
  }
}
```

---

## 📞 Support

Để được hỗ trợ, vui lòng liên hệ team phát triển hoặc tạo issue trên GitHub repository.
