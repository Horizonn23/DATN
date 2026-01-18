# Hướng dẫn Seed Dữ liệu Demo cho Revenue Prediction

## 📝 Tổng quan

File `orderSeeder.ts` tạo dữ liệu đơn hàng ảo cho 12 tháng gần đây với xu hướng tăng trưởng tự nhiên, giúp bạn test và demo module dự báo doanh thu mà không cần dữ liệu thực.

## 🎯 Đặc điểm dữ liệu được tạo

- **Thời gian**: 12 tháng gần đây
- **Số đơn hàng**: Tăng dần từ 15-40 đơn/tháng (mô phỏng tăng trưởng)
- **Giá trị đơn hàng**: Ngẫu nhiên 1-5 sản phẩm/đơn
- **Trạng thái**: Tất cả đơn đều COMPLETED (để có dữ liệu doanh thu)
- **Xu hướng**: Tăng trưởng tuyến tính (~2 đơn/tháng)

## 🚀 Cách sử dụng

### 1. Seed toàn bộ database (bao gồm orders)

```bash
npm run seed
```

Lệnh này sẽ:

- Xóa dữ liệu cũ
- Seed users, categories, products
- Seed orders demo (12 tháng)
- Hiển thị thống kê doanh thu

### 2. Chỉ seed orders (nếu đã có users & products)

```bash
npm run seed:orders
```

Sử dụng khi:

- Bạn đã có users và products
- Chỉ muốn thêm/refresh dữ liệu orders
- Test lại mô hình với dữ liệu mới

### 3. Xóa tất cả orders demo

```bash
npm run seed:clear-orders
```

Sử dụng khi:

- Muốn xóa dữ liệu demo
- Chuẩn bị seed lại từ đầu

## 📊 Ví dụ Output

```
🛒 Seeding demo orders for revenue prediction...
  📅 Creating 17 orders for 1/2025...
  📅 Creating 19 orders for 2/2025...
  📅 Creating 21 orders for 3/2025...
  ...
  📅 Creating 37 orders for 12/2025...
✅ Created 312 demo orders successfully!

📊 Order Statistics:
  Total Revenue: 1,245,678,000 VND
  Total Orders: 312
  Average Order Value: 3,991,917 VND
  Date Range: 18/1/2025 to 28/12/2025
```

## 🔍 Kiểm tra dữ liệu

Sau khi seed, bạn có thể:

### 1. Xem trong database

```sql
SELECT
  DATE_FORMAT(completedAt, '%Y-%m') as month,
  COUNT(*) as order_count,
  SUM(
    (SELECT SUM(pd.price * oi.quantity)
     FROM OrderItem oi
     JOIN ProductDetail pd ON oi.productDetailId = pd.id
     WHERE oi.orderId = o.id)
  ) as revenue
FROM `Order` o
WHERE status IN ('COMPLETED', 'DELIVERED')
GROUP BY DATE_FORMAT(completedAt, '%Y-%m')
ORDER BY month;
```

### 2. Test API Revenue Prediction

**Bước 1: Huấn luyện mô hình**

```bash
curl -X POST http://localhost:3000/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain": 12}'
```

**Bước 2: Xem dữ liệu lịch sử**

```bash
curl -X GET "http://localhost:3000/revenue-prediction/historical-data?months=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Bước 3: Dự báo tháng tiếp theo**

```bash
curl -X GET "http://localhost:3000/revenue-prediction/predict?month=2&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⚙️ Tùy chỉnh dữ liệu

Bạn có thể chỉnh sửa file `orderSeeder.ts` để thay đổi:

### Số lượng đơn hàng mỗi tháng

```typescript
// Line ~75
const baseOrders = 15; // Thay đổi số đơn tối thiểu
const growthFactor = (12 - monthOffset) * 2; // Thay đổi tốc độ tăng
```

### Khoảng thời gian

```typescript
// Line ~69
for (let monthOffset = 12; monthOffset >= 1; monthOffset--) {
  // Thay 12 thành 6 nếu chỉ muốn 6 tháng dữ liệu
```

### Số sản phẩm trong đơn hàng

```typescript
// Line ~110
const numberOfItems = Math.floor(Math.random() * 4) + 1; // 1-5 items
// Thay thành Math.floor(Math.random() * 2) + 1 nếu muốn 1-3 items
```

## 🎨 Mô phỏng các scenario khác nhau

### Scenario 1: Tăng trưởng mạnh

```typescript
const growthFactor = (12 - monthOffset) * 5; // Tăng x2.5 lần
```

### Scenario 2: Tăng trưởng ổn định

```typescript
const growthFactor = (12 - monthOffset) * 1; // Tăng chậm
```

### Scenario 3: Có biến động (realistic)

```typescript
const randomVariation = Math.floor(Math.random() * 10) - 5; // ±5 đơn
const numberOfOrders = baseOrders + growthFactor + randomVariation;
```

## 🐛 Troubleshooting

### Lỗi: "No users found"

```bash
# Seed users trước
npm run seed
```

### Lỗi: "No products found"

```bash
# Đảm bảo đã seed products
npm run seed
```

### Lỗi: "No address data found"

```bash
# Seed address data
npm run seed:address
```

### Muốn seed lại từ đầu

```bash
# Xóa và seed lại toàn bộ
npm run seed:clear-orders
npm run seed
```

## 📈 Kết quả mong đợi

Sau khi seed thành công, mô hình dự báo sẽ có:

- **Độ chính xác cao** (R² > 0.8) vì dữ liệu có xu hướng tuyến tính rõ ràng
- **Slope dương** (doanh thu tăng theo thời gian)
- **Dự báo ổn định** cho các tháng tiếp theo

Ví dụ kết quả training:

```json
{
  "success": true,
  "dataPoints": 12,
  "slope": 18500000, // Tăng ~18.5M VND/tháng
  "intercept": 85000000, // Doanh thu cơ sở ~85M VND
  "r2Score": 0.92 // Độ chính xác 92%
}
```

## 💡 Tips

1. **Seed định kỳ**: Chạy lại `npm run seed:orders` mỗi tuần để có dữ liệu mới
2. **Test nhiều scenario**: Thử các cấu hình khác nhau để test độ robust của mô hình
3. **Kết hợp dữ liệu thực**: Sau khi có dữ liệu thực, giữ cả 2 để so sánh
4. **Backup trước khi clear**: Nếu có dữ liệu quan trọng, backup database trước khi xóa

## 🔗 Liên quan

- [Revenue Prediction README](../src/modules/revenue-prediction/README.md)
- [API Examples](../REVENUE_PREDICTION_EXAMPLES.md)
- [Main Seed Documentation](./README.md)
