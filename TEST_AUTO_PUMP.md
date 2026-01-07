# Test Auto Pump System

## Các bước test hệ thống bơm tự động

### 1. Tạo device mới
```bash
POST http://localhost:5000/api/v1/devices
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "hardware_id": "esp32-27",
  "name": "Smart Garden Device"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device created successfully",
  "data": {
    "device": {
      "_id": "...",
      "hardware_id": "esp32-27",
      "name": "Smart Garden Device",
      "pump_mode": "OFF",
      "auto_pump_config": {
        "enabled": true,
        "threshold_moisture": 40
      }
    }
  }
}
```

---

### 2. Kiểm tra thông tin device
```bash
GET http://localhost:5000/api/v1/devices/<deviceId>
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device": {
      "pump_mode": "OFF",
      "auto_pump_config": {
        "enabled": true,
        "threshold_moisture": 40,
        "last_checked_at": null
      }
    }
  }
}
```

---

### 3. Cập nhật ngưỡng độ ẩm (nếu cần)
```bash
PUT http://localhost:5000/api/v1/devices/<deviceId>/auto-pump
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "threshold_moisture": 50
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auto pump config updated successfully",
  "data": {
    "auto_pump_config": {
      "enabled": true,
      "threshold_moisture": 50
    },
    "pump_mode": "OFF"
  }
}
```

---

### 4. Bật pump ở chế độ AUTO
```bash
POST http://localhost:5000/api/v1/control/device/<deviceId>
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "pump": "AUTO"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Auto pump mode activated. Pump will automatically turn off when soil moisture reaches 50%",
  "data": {
    "pump_mode": "AUTO",
    "threshold_moisture": 50,
    "houses_response": {
      "message": "Command sent successfully"
    }
  }
}
```

---

### 5. Kiểm tra logs của cron job

Sau khi bật AUTO mode, kiểm tra server logs mỗi 2 phút:

```
⏰ [CRON] Auto pump check triggered at: 1/7/2026, 2:30:00 PM
⚙️ [AUTO-PUMP] Checking 1 device(s) in AUTO mode
📊 [AUTO-PUMP] esp32-27: Moisture=35%, Threshold=50%, Mode=AUTO
⏳ [AUTO-PUMP] esp32-27: Moisture not reached threshold yet. Pump remains in AUTO mode
✅ [AUTO-PUMP] Auto pump check completed

⏰ [CRON] Auto pump check triggered at: 1/7/2026, 2:32:00 PM
⚙️ [AUTO-PUMP] Checking 1 device(s) in AUTO mode
📊 [AUTO-PUMP] esp32-27: Moisture=52%, Threshold=50%, Mode=AUTO
🛑 [AUTO-PUMP] esp32-27: Soil moisture reached threshold. Turning pump OFF (52% >= 50%)
✅ [AUTO-PUMP] esp32-27: Pump turned OFF successfully
✅ [AUTO-PUMP] Auto pump check completed
```

---

### 6. Kiểm tra sau khi tự động tắt
```bash
GET http://localhost:5000/api/v1/devices/<deviceId>
Authorization: Bearer <your_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "device": {
      "pump_mode": "OFF",  // ← Đã chuyển từ AUTO sang OFF
      "auto_pump_config": {
        "enabled": true,
        "threshold_moisture": 50,
        "last_checked_at": "2026-01-07T14:32:00.000Z"
      }
    }
  }
}
```

---

## Test Cases

### Case 1: Bơm tự động tắt khi đủ ngưỡng ✅
1. Bật pump AUTO (threshold = 40%)
2. Độ ẩm đất = 35% → Pump tiếp tục bơm
3. Độ ẩm đất = 42% → Pump tự động tắt (OFF)

### Case 2: Thay đổi ngưỡng ✅
1. Cấu hình threshold = 40%
2. Bật pump AUTO
3. Cập nhật threshold = 60%
4. Pump sẽ tắt khi độ ẩm đạt 60% (không phải 40%)

### Case 3: Điều khiển thủ công ✅
1. Bật pump ON → Không tự động tắt
2. Tắt pump OFF → Dừng ngay
3. Bật pump AUTO → Tự động tắt khi đủ ngưỡng

### Case 4: Tắt tính năng auto pump ✅
```bash
PUT /api/v1/devices/<deviceId>/auto-pump
{ "enabled": false }
```
→ Cron job sẽ bỏ qua device này

---

## Expected Behavior

### Khi pump_mode = "ON"
- Pump bơm liên tục
- Cron job không can thiệp
- Cần tắt thủ công bằng pump: "OFF"

### Khi pump_mode = "OFF"
- Pump tắt
- Cron job không can thiệp

### Khi pump_mode = "AUTO"
- Pump bơm
- Cron job kiểm tra mỗi 2 phút
- Tự động chuyển sang OFF khi độ ẩm >= threshold
- Log chi tiết trong console

---

## Troubleshooting

### Vấn đề: Pump không tự động tắt
**Kiểm tra:**
1. `pump_mode` có đang là "AUTO"?
2. `auto_pump_config.enabled` có là true?
3. Cron job có đang chạy? (Kiểm tra logs)
4. Houses_server có hoạt động không?
5. Sensor có trả về dữ liệu không?

### Vấn đề: Cron job không chạy
**Khắc phục:**
```javascript
// Trong app.js, đảm bảo có:
const cronService = require('./services/cronService');
cronService.initializeCronJobs();
```

### Vấn đề: Không lấy được dữ liệu sensor
**Kiểm tra:**
1. Houses_server có đang chạy?
2. `hardware_id` có đúng không?
3. Sensor có gửi dữ liệu lên Houses_server không?

---

## Performance Notes

- Cron job chạy mỗi 2 phút (có thể điều chỉnh trong cronService.js)
- Mỗi lần check gọi 1 API đến Houses_server per device
- Nếu có nhiều devices ở AUTO mode, cân nhắc tối ưu hóa batch requests
