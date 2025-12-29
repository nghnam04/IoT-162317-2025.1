# API Documentation - UI Backend

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

Tất cả các API yêu cầu authentication (trừ register và login) phải gửi kèm JWT Token trong header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Authentication

#### 1.1. Đăng ký
```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "username": "nguyenvana",
  "email": "a@gmail.com",
  "password": "123456",
  "full_name": "Nguyen Van A"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 1.2. Đăng nhập
```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "identifier": "nguyenvana",  // username hoặc email
  "password": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "..."
  }
}
```

#### 1.3. Lấy thông tin user hiện tại
```http
GET /api/v1/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "nguyenvana",
      "email": "a@gmail.com",
      "full_name": "Nguyen Van A",
      "role": "user",
      "created_at": "2025-12-29..."
    }
  }
}
```

---

### 2. Monitoring (Proxy đến Houses Server)

#### 2.1. Lấy dữ liệu cảm biến hiện tại
```http
GET /api/v1/monitor/current
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Latest sensor data retrieved successfully",
  "data": {
    "temperature": 28.5,
    "humidity": 65,
    "light": 850,
    "pump_status": "OFF",
    "timestamp": "2025-12-29T10:30:00Z"
  }
}
```

#### 2.2. Lấy lịch sử dữ liệu
```http
GET /api/v1/monitor/history?startDate=2025-12-01&endDate=2025-12-29&type=temp
```

**Query Parameters:**
- `startDate` (required): Ngày bắt đầu (ISO format)
- `endDate` (required): Ngày kết thúc
- `type` (optional): Loại dữ liệu (temp, humidity, light)

**Response (200):**
```json
{
  "success": true,
  "message": "Sensor history retrieved successfully",
  "data": [
    {
      "timestamp": "2025-12-29T00:00:00Z",
      "value": 28.5
    },
    ...
  ]
}
```

#### 2.3. Lấy trạng thái thiết bị
```http
GET /api/v1/monitor/devices/status
```

**Response (200):**
```json
{
  "success": true,
  "message": "Devices status retrieved successfully",
  "data": {
    "pump": "OFF",
    "light": "ON",
    "fan": "OFF"
  }
}
```

---

### 3. Control (Điều khiển thiết bị)

#### 3.1. Điều khiển thiết bị
```http
POST /api/v1/control/device
```

**Body:**
```json
{
  "deviceId": "PUMP",
  "action": "ON"
}
```

**Valid deviceId:** PUMP, LIGHT, FAN, etc.
**Valid action:** ON, OFF

**Response (200):**
```json
{
  "success": true,
  "message": "Device PUMP is being turned ON",
  "data": {
    "status": "success",
    "timestamp": "2025-12-29T10:30:00Z"
  }
}
```

---

### 4. Settings (Cấu hình người dùng)

#### 4.1. Lấy cấu hình
```http
GET /api/v1/settings
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "email_alert": true,
      "push_alert": false
    },
    "thresholds": {
      "max_temp": 35,
      "min_humidity": 40,
      "max_humidity": 80,
      "min_light": 200
    },
    "updated_at": "2025-12-29T10:30:00Z"
  }
}
```

#### 4.2. Cập nhật cấu hình
```http
PUT /api/v1/settings
```

**Body:**
```json
{
  "notifications": {
    "email_alert": false,
    "push_alert": true
  },
  "thresholds": {
    "max_temp": 38,
    "min_humidity": 35
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {...}
}
```

---

## Error Responses

Tất cả lỗi đều có format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable (Houses Server không khả dụng)
