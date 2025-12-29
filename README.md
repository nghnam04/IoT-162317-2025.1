# UI Backend - IoT Project

Backend server cho hệ thống IoT, đóng vai trò là Gateway giữa Client (Web/Mobile) và Houses Server.

## Tính năng chính

- Quản lý người dùng (Đăng ký, Đăng nhập, Xác thực JWT)
- Làm trung gian (Proxy) giữa Client và Houses Server
- Lưu trữ cấu hình người dùng
- Quản lý ngưỡng cảnh báo

## Cài đặt

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

## Cấu trúc API

### Authentication
- `POST /api/v1/auth/register` - Đăng ký tài khoản
- `POST /api/v1/auth/login` - Đăng nhập
- `GET /api/v1/auth/me` - Lấy thông tin user hiện tại

### Monitoring (Proxy đến Houses Server)
- `GET /api/v1/monitor/current` - Lấy dữ liệu cảm biến hiện tại
- `GET /api/v1/monitor/history` - Lấy lịch sử dữ liệu

### Control (Proxy đến Houses Server)
- `POST /api/v1/control/device` - Điều khiển thiết bị

### Settings
- `GET /api/v1/settings` - Lấy cấu hình người dùng
- `PUT /api/v1/settings` - Cập nhật cấu hình

## Yêu cầu hệ thống

- Node.js >= 14.x
- MongoDB >= 4.x
- Houses Server phải đang chạy tại địa chỉ cấu hình trong HOUSES_SERVER_URL
