# Revenue Prediction Module - Dự báo Doanh thu

Module này sử dụng thuật toán hồi quy tuyến tính đơn giản (Simple Linear Regression) để dự báo doanh thu theo tháng dựa trên dữ liệu lịch sử.

## Cài đặt

Module đã được tích hợp sẵn vào hệ thống. Thư viện sử dụng: `ml-regression-simple-linear`

## API Endpoints

### 1. Huấn luyện mô hình

**POST** `/revenue-prediction/train`

Huấn luyện mô hình dự báo dựa trên dữ liệu lịch sử.

**Body:**

```json
{
  "monthsToTrain": 12
}
```

**Response:**

```json
{
  "success": true,
  "message": "Mô hình đã được huấn luyện thành công",
  "dataPoints": 12,
  "slope": 15000000,
  "intercept": 50000000,
  "r2Score": 0.85
}
```

- `slope`: Độ dốc - tốc độ tăng trưởng doanh thu theo tháng
- `intercept`: Điểm cắt - doanh thu cơ sở
- `r2Score`: Độ chính xác của mô hình (0-1, càng gần 1 càng chính xác)

### 2. Dự báo doanh thu cho một tháng

**GET** `/revenue-prediction/predict?month=1&year=2026`

Dự báo doanh thu cho một tháng cụ thể.

**Query Parameters:**

- `month` (required): Tháng cần dự báo (1-12)
- `year` (optional): Năm cần dự báo (mặc định là năm hiện tại)

**Response:**

```json
{
  "predictedRevenue": 180000000,
  "month": 1,
  "year": 2026,
  "confidence": 0.85,
  "modelAccuracy": 0.85
}
```

### 3. Dự báo nhiều tháng tiếp theo

**GET** `/revenue-prediction/predict-next-months?months=3`

Dự báo doanh thu cho N tháng tiếp theo.

**Query Parameters:**

- `months`: Số tháng cần dự báo (mặc định: 3)

**Response:**

```json
[
  {
    "predictedRevenue": 180000000,
    "month": 2,
    "year": 2026,
    "confidence": 0.85,
    "modelAccuracy": 0.85
  },
  {
    "predictedRevenue": 195000000,
    "month": 3,
    "year": 2026,
    "confidence": 0.85,
    "modelAccuracy": 0.85
  }
]
```

### 4. Lấy thông tin mô hình

**GET** `/revenue-prediction/model-info`

Lấy thông tin chi tiết về mô hình hiện tại.

**Response:**

```json
{
  "isTrained": true,
  "dataPoints": 12,
  "slope": 15000000,
  "intercept": 50000000,
  "r2Score": 0.85,
  "trainingPeriod": {
    "from": {
      "month": 1,
      "year": 2025
    },
    "to": {
      "month": 12,
      "year": 2025
    }
  }
}
```

### 5. Lấy dữ liệu lịch sử

**GET** `/revenue-prediction/historical-data?months=12`

Lấy dữ liệu doanh thu lịch sử để phân tích.

**Query Parameters:**

- `months`: Số tháng dữ liệu cần lấy (mặc định: 12)

**Response:**

```json
[
  {
    "month": 1,
    "year": 2025,
    "revenue": 120000000,
    "orderCount": 150
  },
  {
    "month": 2,
    "year": 2025,
    "revenue": 135000000,
    "orderCount": 180
  }
]
```

### 6. Lấy doanh thu thực tế

**GET** `/revenue-prediction/actual-revenue?month=1&year=2025`

Lấy doanh thu thực tế của một tháng để so sánh với dự báo.

**Query Parameters:**

- `month`: Tháng
- `year`: Năm

**Response:**

```json
{
  "month": 1,
  "year": 2025,
  "revenue": 125000000
}
```

## Cách sử dụng

### Bước 1: Huấn luyện mô hình lần đầu

```bash
curl -X POST http://localhost:3000/revenue-prediction/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain": 12}'
```

### Bước 2: Dự báo doanh thu

```bash
curl -X GET "http://localhost:3000/revenue-prediction/predict?month=2&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Bước 3: Xem dự báo nhiều tháng

```bash
curl -X GET "http://localhost:3000/revenue-prediction/predict-next-months?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Lưu ý

1. **Quyền truy cập**: Tất cả API endpoints yêu cầu quyền ADMIN
2. **Dữ liệu huấn luyện**: Mô hình sử dụng dữ liệu từ các đơn hàng có status là COMPLETED hoặc DELIVERED
3. **Tự động huấn luyện**: Nếu mô hình chưa được huấn luyện, hệ thống sẽ tự động huấn luyện khi gọi API predict
4. **R² Score**:
   - > 0.7: Mô hình tốt
   - 0.5 - 0.7: Mô hình khá
   - < 0.5: Cần thêm dữ liệu hoặc điều chỉnh
5. **Dữ liệu tối thiểu**: Cần ít nhất 2 điểm dữ liệu (2 tháng) để huấn luyện mô hình

## Công thức toán học

Mô hình sử dụng công thức hồi quy tuyến tính:

```
Y = a + bX
```

Trong đó:

- Y: Doanh thu dự báo
- X: Số tháng (1, 2, 3, ...)
- a: Intercept (điểm cắt)
- b: Slope (độ dốc - tốc độ tăng trưởng)

## Độ chính xác (R² Score)

R² = 1 - (SS_res / SS_tot)

Trong đó:

- SS_res: Tổng bình phương phần dư (sai số)
- SS_tot: Tổng bình phương toàn phần

R² gần 1 nghĩa là mô hình dự báo rất chính xác.

## Ví dụ thực tế

Giả sử bạn có dữ liệu 12 tháng với doanh thu tăng đều:

- Tháng 1: 100M VND
- Tháng 2: 115M VND
- Tháng 3: 130M VND
- ...
- Tháng 12: 265M VND

Mô hình sẽ:

1. Phân tích xu hướng tăng trưởng (~15M/tháng)
2. Tính toán slope ≈ 15,000,000 và intercept ≈ 85,000,000
3. Dự báo tháng 13: 85M + 15M × 13 = 280M VND
4. R² score cao (>0.9) vì dữ liệu có xu hướng tuyến tính rõ ràng

## Mở rộng tương lai

1. Thêm mô hình phức tạp hơn (polynomial regression, ARIMA)
2. Tích hợp thêm yếu tố: mùa vụ, sự kiện, marketing
3. Hỗ trợ dự báo theo danh mục sản phẩm
4. Xuất báo cáo dạng biểu đồ
