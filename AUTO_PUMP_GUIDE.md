# Auto Pump System - Hướng dẫn sử dụng

## 📝 Tổng quan

Hệ thống bơm tự động đã được đơn giản hóa. Thay vì dùng `automation_configs` phức tạp với lịch trình và thời gian, giờ đây chỉ cần:

### **3 trạng thái pump:**
- `ON` - Bật bơm thủ công
- `OFF` - Tắt bơm thủ công  
- `AUTO` - Bật bơm tự động (hệ thống sẽ tự động tắt khi độ ẩm đất đạt ngưỡng)

## 🔧 Cách hoạt động

### 1. Điều khiển pump
Gửi API để điều khiển pump:

```http
POST /api/v1/control/device/:deviceId
Authorization: Bearer <token>

{
  "pump": "AUTO"
}
```

**Các trạng thái hợp lệ:** `ON`, `OFF`, `AUTO`

### 2. Khi pump ở chế độ AUTO

Khi pump được đặt về `AUTO`:
- Pump sẽ tiếp tục bơm nước
- Hệ thống tự động kiểm tra độ ẩm đất mỗi **2 phút** (cron job)
- Khi độ ẩm đất **>= ngưỡng** (threshold_moisture), pump tự động **chuyển sang OFF**

#### Ví dụ:
```
- Ngưỡng cấu hình: 40%
- Pump mode: AUTO
- Độ ẩm đất hiện tại: 35% → Pump tiếp tục bơm
- Độ ẩm đất hiện tại: 42% → Pump tự động tắt (OFF)
```

### 3. Cấu hình ngưỡng độ ẩm

Owner có thể cập nhật cấu hình bơm tự động:

```http
PUT /api/v1/devices/:deviceId/auto-pump
Authorization: Bearer <token>

{
  "enabled": true,
  "threshold_moisture": 45
}
```

**Tham số:**
- `enabled` (boolean) - Bật/tắt tính năng auto pump
- `threshold_moisture` (number, 0-100) - Ngưỡng độ ẩm đất để tắt bơm

## 📊 Schema Device mới

```javascript
{
  hardware_id: "esp32-27",
  name: "Smart Garden Device",
  type: "Sensor",
  
  // Trạng thái pump hiện tại
  pump_mode: "AUTO",  // ON | OFF | AUTO
  
  // Cấu hình bơm tự động
  auto_pump_config: {
    enabled: true,              // Bật/tắt auto pump
    threshold_moisture: 40,     // Tắt bơm khi độ ẩm đất >= 40%
    last_checked_at: Date       // Lần cuối kiểm tra
  }
}
```

## 🔄 Cron Job

Hệ thống chạy cron job mỗi **2 phút** để:
1. Tìm tất cả devices có `pump_mode = "AUTO"`
2. Lấy dữ liệu độ ẩm đất từ Houses_server
3. So sánh với `threshold_moisture`
4. Nếu độ ẩm đất >= ngưỡng → Gửi lệnh OFF + cập nhật `pump_mode = "OFF"`

## 📡 Flow hoạt động

```
User → API: POST /control/device/123 { pump: "AUTO" }
         ↓
    Database: pump_mode = "AUTO"
         ↓
  Houses_server: Gửi lệnh AUTO
         ↓
   [Mỗi 2 phút]
         ↓
   Cron Job kiểm tra
         ↓
  Lấy soil_moisture từ Houses_server
         ↓
  So sánh với threshold_moisture
         ↓
  Nếu >= ngưỡng:
    - Houses_server: Gửi lệnh OFF
    - Database: pump_mode = "OFF"
```

## ✨ Ưu điểm

### Trước đây (automation_configs)
```javascript
automation_configs: {
  auto_pump: {
    enabled: true,
    threshold_moisture: 40,
    duration_seconds: 30,
    schedules: [
      {
        enabled: true,
        type: 'daily',
        time: { hour: 6, minute: 0 },
        days_of_week: [],
        duration_seconds: 20,
        last_executed_at: Date
      }
    ]
  }
}
```
❌ Phức tạp, khó quản lý
❌ Cần logic lịch trình phức tạp
❌ Khó hiểu với người dùng

### Bây giờ (pump_mode + auto_pump_config)
```javascript
pump_mode: "AUTO",
auto_pump_config: {
  enabled: true,
  threshold_moisture: 40,
  last_checked_at: Date
}
```
✅ Đơn giản, dễ hiểu
✅ Chỉ cần gọi API với pump: "AUTO"
✅ Tự động tắt khi đủ ngưỡng
✅ Phù hợp với Houses_server (ON/OFF/AUTO)

## 🚀 Sử dụng thực tế

### Kịch bản 1: Bật bơm tự động
```bash
# Bước 1: Bật pump AUTO
POST /api/v1/control/device/abc123
{ "pump": "AUTO" }

# → Pump bắt đầu bơm
# → Cron job kiểm tra mỗi 2 phút
# → Khi độ ẩm đất >= 40%, tự động tắt
```

### Kịch bản 2: Thay đổi ngưỡng
```bash
# Nếu muốn tắt bơm khi độ ẩm đạt 50% thay vì 40%
PUT /api/v1/devices/abc123/auto-pump
{ "threshold_moisture": 50 }
```

### Kịch bản 3: Điều khiển thủ công
```bash
# Bật bơm thủ công (không tự động tắt)
POST /api/v1/control/device/abc123
{ "pump": "ON" }

# Tắt bơm thủ công
POST /api/v1/control/device/abc123
{ "pump": "OFF" }
```

## 🎯 API Endpoints

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/v1/control/device/:deviceId` | POST | Điều khiển pump (ON/OFF/AUTO) |
| `/api/v1/devices/:deviceId/auto-pump` | PUT | Cập nhật cấu hình auto pump (Owner only) |
| `/api/v1/devices/:deviceId` | GET | Xem thông tin device (bao gồm pump_mode và auto_pump_config) |

## 📝 Notes

- Chỉ **Owner** mới có quyền thay đổi `auto_pump_config`
- Tất cả users có quyền truy cập đều có thể điều khiển pump (ON/OFF/AUTO)
- Cron job chạy tự động khi server khởi động
- Log chi tiết được ghi trong console để theo dõi
