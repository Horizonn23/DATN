# 🚀 Quick Start - Revenue Prediction Demo

## Bước 1: Seed dữ liệu demo

Tạo 343 đơn hàng ảo cho 12 tháng với xu hướng tăng trưởng:

```bash
npm run seed:orders
```

**Kết quả:**

```
✅ Created 343 demo orders successfully!
📊 Order Statistics:
  Total Revenue: 6.093.609.000 VND
  Total Orders: 343
  Average Order Value: 17.765.623 VND
```

## Bước 2: Khởi động server

```bash
npm run dev
```

## Bước 3: Lấy token Admin

**Sử dụng Postman/cURL:**

```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-admin-password"
  }'
```

Lưu `access_token` từ response.

## Bước 4: Chạy Demo

```bash
node demo-revenue-prediction.js YOUR_TOKEN
```

**Output mẫu:**

```
╔════════════════════════════════════════════════════════════╗
║     DEMO DỰ BÁO DOANH THU - SUGAR PAWS                    ║
╚════════════════════════════════════════════════════════════╝

📊 BƯỚC 1: Lấy dữ liệu doanh thu lịch sử (12 tháng)

┌─────────────┬───────────────┬──────────────────┐
│    Tháng    │  Số đơn hàng  │  Doanh thu       │
├─────────────┼───────────────┼──────────────────┤
│ 1/2025      │           17  │   293.815.000 ₫  │
│ 2/2025      │           20  │   356.200.000 ₫  │
...

🤖 BƯỚC 2: Huấn luyện mô hình Machine Learning

✅ Mô hình đã được huấn luyện thành công
   📊 Số điểm dữ liệu: 12
   📈 Slope (tốc độ tăng): 41.500.000 ₫/tháng
   📍 Intercept (cơ sở): 250.000.000 ₫
   🎯 Độ chính xác (R²): 89.45%
   🟢 Xuất sắc - Mô hình dự báo rất chính xác!

🔮 BƯỚC 3: Dự báo doanh thu 6 tháng tiếp theo

┌─────────────┬──────────────────┬────────────────┐
│    Tháng    │  Doanh thu dự báo│  Độ tin cậy    │
├─────────────┼──────────────────┼────────────────┤
│ 1/2026      │   795.500.000 ₫  │          89.5% │
│ 2/2026      │   837.000.000 ₫  │          89.5% │
...
```

## 🎯 Test API trực tiếp

### 1. Huấn luyện mô hình

```bash
curl -X POST http://localhost:5080/api/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain": 12}'
```

### 2. Xem dữ liệu lịch sử

```bash
curl http://localhost:5080/api/revenue-prediction/historical-data?months=12 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Dự báo tháng tiếp theo

```bash
curl "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Dự báo 6 tháng

```bash
curl "http://localhost:5080/api/revenue-prediction/predict-next-months?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Tài liệu chi tiết

- [Revenue Prediction Module](./src/modules/revenue-prediction/README.md) - Chi tiết module và API
- [Order Seeder Guide](./prisma/seed/ORDER_SEEDER_GUIDE.md) - Hướng dẫn seed dữ liệu
- [API Examples](./REVENUE_PREDICTION_EXAMPLES.md) - Ví dụ sử dụng API với cURL, PowerShell, Postman

## 🔄 Reset dữ liệu

Xóa orders demo và seed lại:

```bash
npm run seed:clear-orders
npm run seed:orders
```

## 💡 Tips

1. **Thêm dữ liệu**: Chạy `npm run seed:orders` nhiều lần để có thêm dữ liệu (cẩn thận với duplicate)
2. **Huấn luyện lại**: Sau khi thêm dữ liệu mới, gọi API `/train` để cập nhật mô hình
3. **Swagger UI**: Truy cập `http://localhost:5080/api/api` để test API trực quan
4. **R² Score**: > 0.8 là tốt, 0.6-0.8 là khá, < 0.6 cần thêm dữ liệu

## 🎨 Tùy chỉnh

Chỉnh sửa `prisma/seed/orderSeeder.ts` để thay đổi:

- Số lượng đơn hàng/tháng
- Khoảng thời gian
- Xu hướng tăng trưởng
- Giá trị đơn hàng

Xem chi tiết trong [Order Seeder Guide](./prisma/seed/ORDER_SEEDER_GUIDE.md)
