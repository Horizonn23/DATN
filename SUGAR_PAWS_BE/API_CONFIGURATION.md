# ⚙️ Configuration & Setup - Revenue Prediction

## 🔧 Server Configuration

### Backend đang chạy tại:

- **Host**: `localhost`
- **Port**: `5080` (từ file `.env`)
- **API Prefix**: `/api` (từ `main.ts`)

### Base URLs:

- **API Base**: `http://localhost:5080/api`
- **Swagger UI**: `http://localhost:5080/api/docs`
- **Revenue Prediction**: `http://localhost:5080/api/revenue-prediction`

## 📡 API Endpoints (Đã update với port 5080)

### 1. Huấn luyện mô hình

```bash
curl -X POST http://localhost:5080/api/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain": 12}'
```

### 2. Dự báo doanh thu

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Dự báo nhiều tháng

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/predict-next-months?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Xem thông tin mô hình

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/model-info" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Dữ liệu lịch sử

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/historical-data?months=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Doanh thu thực tế

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/actual-revenue?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔐 Lấy Admin Token

```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Response:

```json
{
  "access_token": "eyJhbGc...",
  "user": {...}
}
```

## 🎯 Test với Postman

### Setup Environment

1. Tạo environment mới: "Sugar Paws - Local"
2. Thêm variables:
   ```
   baseUrl: http://localhost:5080/api
   token: YOUR_ACCESS_TOKEN
   ```

### Request mẫu:

**Train Model**

- Method: `POST`
- URL: `{{baseUrl}}/revenue-prediction/train`
- Headers:
  - `Authorization`: `Bearer {{token}}`
  - `Content-Type`: `application/json`
- Body (raw JSON):
  ```json
  {
    "monthsToTrain": 12
  }
  ```

## 🌐 Swagger UI

Truy cập: `http://localhost:5080/api/docs`

1. Click **Authorize** button (góc trên bên phải)
2. Nhập: `Bearer YOUR_ACCESS_TOKEN`
3. Click **Authorize**
4. Expand **Revenue Prediction** section
5. Test các endpoints trực tiếp

## 🚀 Demo Scripts (Đã update)

### 1. Demo Script

```bash
node demo-revenue-prediction.js YOUR_ADMIN_TOKEN
```

Script đã được cập nhật để dùng `http://localhost:5080/api`

### 2. Test Script

```bash
node test-revenue-prediction.js
```

Nhớ cập nhật token trong file trước khi chạy.

## 📝 PowerShell Examples

### Login

```powershell
$body = @{
    email = "admin@example.com"
    password = "your-password"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5080/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"

$token = $response.access_token
Write-Host "Token: $token"
```

### Train Model

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    monthsToTrain = 12
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5080/api/revenue-prediction/train" `
    -Method Post `
    -Headers $headers `
    -Body $body
```

### Predict Revenue

```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" `
    -Method Get `
    -Headers $headers
```

## 🔍 Troubleshooting

### Lỗi: "Cannot GET /revenue-prediction/train"

❌ **Sai**: `http://localhost:5080/revenue-prediction/train`
✅ **Đúng**: `http://localhost:5080/api/revenue-prediction/train`

> Nhớ thêm `/api` prefix!

### Lỗi: "Connection refused"

- Kiểm tra server có đang chạy không: `npm run dev`
- Kiểm tra port trong `.env`: `PORT=5080`
- Kiểm tra terminal có thông báo: `🚀 Application is running on: http://[::1]:5080`

### Lỗi: 401 Unauthorized

- Token đã hết hạn → Login lại để lấy token mới
- Thiếu "Bearer " prefix → Phải là `Bearer YOUR_TOKEN`
- Token không hợp lệ → Copy đúng token từ login response

### Lỗi: 403 Forbidden

- User không có quyền ADMIN
- Đảm bảo login bằng tài khoản admin

## 📊 Port Summary

| Service               | Port | URL                            |
| --------------------- | ---- | ------------------------------ |
| Backend API           | 5080 | http://localhost:5080/api      |
| Swagger Docs          | 5080 | http://localhost:5080/api/docs |
| Database (PostgreSQL) | 5432 | localhost:5432                 |
| Redis                 | 6379 | localhost:6379                 |

## ✅ Quick Check

Kiểm tra server đang chạy đúng chưa:

```bash
curl http://localhost:5080/api/docs
```

Nếu thấy HTML của Swagger → ✅ Server đang chạy đúng!

## 🎓 Best Practices

1. **Luôn dùng biến môi trường** cho URLs:

   ```javascript
   const BASE_URL = process.env.API_URL || 'http://localhost:5080/api';
   ```

2. **Lưu token an toàn**:

   - Không commit token vào git
   - Dùng environment variables
   - Token có thời gian hết hạn (1h theo config)

3. **Test trên Swagger trước** khi viết code

   - Dễ debug
   - Có UI trực quan
   - Tự động generate request examples

4. **Huấn luyện lại định kỳ**:
   - Mỗi tuần chạy seed:orders để thêm data
   - Sau đó train lại model để cập nhật
