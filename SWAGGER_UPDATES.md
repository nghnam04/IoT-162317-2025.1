# Swagger Documentation Updates - v2.1

## 📝 Tóm tắt cập nhật

Đã cập nhật Swagger documentation để phản ánh hệ thống Auto Pump mới (v2.1).

---

## ✅ Các thay đổi chính

### 1. API Version & Description
**File:** [swagger.js](d:\IoT_project\ui_backend\src\config\swagger.js)

- Version: `2.0.0` → `2.1.0`
- Thêm mô tả chi tiết về Auto Pump System
- Hướng dẫn sử dụng ngay trong Swagger UI

### 2. Device Schema
**File:** [swagger.js](d:\IoT_project\ui_backend\src\config\swagger.js)

**Đã xóa:**
```javascript
automation_configs: {
  auto_pump: {
    enabled: Boolean,
    threshold_moisture: Number,
    duration_seconds: Number,
    schedules: Array
  }
}
```

**Thêm mới:**
```javascript
pump_mode: {
  type: String,
  enum: ['ON', 'OFF', 'AUTO'],
  description: 'Trạng thái pump hiện tại'
}

auto_pump_config: {
  enabled: Boolean,
  threshold_moisture: Number (0-100),
  last_checked_at: Date
}
```

### 3. Control API
**File:** [controlRoutes.js](d:\IoT_project\ui_backend\src\routes\controlRoutes.js)

**Endpoint:** `POST /control/device/{deviceId}`

**Thay đổi:**
- Enum pump: `[ON, OFF]` → `[ON, OFF, AUTO]`
- Cập nhật description: "Bật/Tắt/Auto máy bơm"
- Thêm chi tiết về AUTO mode
- Response example với AUTO mode

**Request Example:**
```json
{
  "pump": "AUTO"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Auto pump mode activated. Pump will automatically turn off when soil moisture reaches 40%",
  "data": {
    "pump_mode": "AUTO",
    "threshold_moisture": 40,
    "houses_response": {
      "message": "Command sent successfully"
    }
  }
}
```

### 4. Auto Pump Config API
**File:** [deviceRoutes.js](d:\IoT_project\ui_backend\src\routes\deviceRoutes.js)

**Endpoint:** `PUT /devices/{deviceId}/auto-pump`

**Thêm mới:**
- Description chi tiết về cách hoạt động
- Request examples (updateThreshold, enableAutoPump, disableAutoPump)
- Response schema đầy đủ
- Error responses (400, 403)

**Request Examples:**
```json
// Thay đổi ngưỡng
{
  "threshold_moisture": 50
}

// Bật auto pump
{
  "enabled": true
}

// Tắt auto pump
{
  "enabled": false
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Auto pump config updated successfully",
  "data": {
    "auto_pump_config": {
      "enabled": true,
      "threshold_moisture": 45,
      "last_checked_at": "2026-01-07T10:30:00.000Z"
    },
    "pump_mode": "OFF"
  }
}
```

### 5. Validator Updates
**File:** [controlRoutes.js](d:\IoT_project\ui_backend\src\routes\controlRoutes.js)

Cập nhật express-validator để chấp nhận AUTO:
```javascript
.isIn(['ON', 'OFF', 'AUTO', 'on', 'off', 'auto'])
.withMessage('pump must be ON, OFF, or AUTO')
```

---

## 🔍 Testing Swagger

### Cách test:
1. Khởi động server: `npm start`
2. Truy cập: http://localhost:5000/api-docs
3. Test các endpoints:

#### Test Control API
```bash
# Try it out với AUTO mode
POST /control/device/{deviceId}
{
  "pump": "AUTO"
}
```

#### Test Auto Pump Config API
```bash
# Try it out với threshold mới
PUT /devices/{deviceId}/auto-pump
{
  "threshold_moisture": 50
}
```

---

## 📚 Files đã thay đổi

| File | Changes |
|------|---------|
| [swagger.js](d:\IoT_project\ui_backend\src\config\swagger.js) | - Version 2.1.0<br>- Device schema mới<br>- Description cập nhật |
| [controlRoutes.js](d:\IoT_project\ui_backend\src\routes\controlRoutes.js) | - Hỗ trợ AUTO enum<br>- Response examples mới<br>- Validator cập nhật |
| [deviceRoutes.js](d:\IoT_project\ui_backend\src\routes\deviceRoutes.js) | - Swagger doc chi tiết cho /auto-pump<br>- Request/Response examples |

---

## 🎯 Swagger UI Features

Khi truy cập http://localhost:5000/api-docs, bạn sẽ thấy:

### Control Section
- **POST /control/device/{deviceId}**
  - Dropdown enum: ON, OFF, AUTO
  - Example request với AUTO mode
  - Response chi tiết với threshold info

### Devices Section
- **PUT /devices/{deviceId}/auto-pump**
  - 3 ví dụ request có sẵn (threshold, enable, disable)
  - Response schema đầy đủ
  - Error cases documented

### Schemas Section
- **Device** schema với pump_mode và auto_pump_config
- Descriptions chi tiết cho từng field

---

## ✨ Highlights

### Auto Pump Description trong Swagger UI
```
Cách sử dụng Auto Pump:
1. Bật pump ở chế độ AUTO: POST /control/device/{id} với { "pump": "AUTO" }
2. Hệ thống tự động kiểm tra độ ẩm đất mỗi 2 phút
3. Khi độ ẩm đất >= threshold_moisture, pump tự động chuyển sang OFF
4. Thay đổi ngưỡng: PUT /devices/{id}/auto-pump với { "threshold_moisture": 50 }
```

### Interactive Examples
Swagger UI có sẵn các ví dụ để test:
- ✅ Bật AUTO mode
- ✅ Thay đổi threshold
- ✅ Enable/disable auto pump
- ✅ Response examples thực tế

---

## 🚀 Next Steps

1. Restart server để load Swagger mới:
   ```bash
   npm start
   ```

2. Truy cập Swagger UI:
   ```
   http://localhost:5000/api-docs
   ```

3. Test các endpoints mới với "Try it out"

4. Share Swagger link với team để họ biết cách sử dụng Auto Pump API

---

## 📝 Notes

- Swagger documentation phản ánh chính xác implementation hiện tại
- Tất cả enum values đã được cập nhật (ON/OFF/AUTO)
- Response examples realistic và có thể test được
- Error cases được document đầy đủ
- Description chi tiết giúp developer hiểu ngay cách sử dụng
