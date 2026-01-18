# Ví dụ sử dụng API Revenue Prediction với cURL

## Lấy token đăng nhập (thay thế email/password của admin)

```bash
curl -X POST http://localhost:5080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your-password"
  }'
```

Lưu `access_token` từ response để sử dụng cho các request tiếp theo.

---

## 1. Kiểm tra thông tin mô hình

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/model-info" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "isTrained": false,
  "message": "Mô hình chưa được huấn luyện"
}
```

---

## 2. Lấy dữ liệu doanh thu lịch sử

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/historical-data?months=12" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
[
  {
    "month": 1,
    "year": 2025,
    "revenue": 125000000,
    "orderCount": 156
  },
  {
    "month": 2,
    "year": 2025,
    "revenue": 138000000,
    "orderCount": 172
  }
]
```

---

## 3. Huấn luyện mô hình

```bash
curl -X POST "http://localhost:5080/api/revenue-prediction/train" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "monthsToTrain": 12
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Mô hình đã được huấn luyện thành công",
  "dataPoints": 12,
  "slope": 14500000,
  "intercept": 110000000,
  "r2Score": 0.87
}
```

**Giải thích:**

- `slope`: Doanh thu tăng trung bình ~14.5M VND/tháng
- `intercept`: Doanh thu cơ sở ~110M VND
- `r2Score`: 0.87 (87%) - mô hình dự báo khá chính xác

---

## 4. Dự báo doanh thu cho một tháng

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "predictedRevenue": 285000000,
  "month": 2,
  "year": 2026,
  "confidence": 0.87,
  "modelAccuracy": 0.87
}
```

Dự báo doanh thu tháng 2/2026: **285,000,000 VND**

---

## 5. Dự báo cho nhiều tháng tiếp theo

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/predict-next-months?months=6" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
[
  {
    "predictedRevenue": 270500000,
    "month": 2,
    "year": 2026,
    "confidence": 0.87,
    "modelAccuracy": 0.87
  },
  {
    "predictedRevenue": 285000000,
    "month": 3,
    "year": 2026,
    "confidence": 0.87,
    "modelAccuracy": 0.87
  },
  ...
]
```

---

## 6. Lấy doanh thu thực tế

```bash
curl -X GET "http://localhost:5080/api/revenue-prediction/actual-revenue?month=1&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "month": 1,
  "year": 2026,
  "revenue": 268000000
}
```

---

## Ví dụ với PowerShell (Windows)

### Huấn luyện mô hình

```powershell
$token = "YOUR_TOKEN"
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

### Dự báo doanh thu

```powershell
$token = "YOUR_TOKEN"
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5080/api/revenue-prediction/predict?month=2&year=2026" `
    -Method Get `
    -Headers $headers
```

---

## Sử dụng với Postman

### Setup

1. Tạo collection mới: "Revenue Prediction"
2. Thêm biến environment:
   - `baseUrl`: `http://localhost:5080/api`
   - `token`: Token từ login

### Request 1: Train Model

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

### Request 2: Predict Revenue

- Method: `GET`
- URL: `{{baseUrl}}/revenue-prediction/predict?month=2&year=2026`
- Headers:
  - `Authorization`: `Bearer {{token}}`

### Request 3: Predict Next Months

- Method: `GET`
- URL: `{{baseUrl}}/revenue-prediction/predict-next-months?months=6`
- Headers:
  - `Authorization`: `Bearer {{token}}`

---

## Kịch bản sử dụng thực tế

### Scenario 1: Báo cáo dự báo hàng tuần

```bash
# Lấy dữ liệu lịch sử
curl -X GET "http://localhost:5080/api/revenue-prediction/historical-data?months=12" \
  -H "Authorization: Bearer $TOKEN" > historical.json

# Huấn luyện lại mô hình với dữ liệu mới
curl -X POST "http://localhost:5080/api/revenue-prediction/train" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"monthsToTrain": 12}'

# Dự báo 3 tháng tiếp theo
curl -X GET "http://localhost:5080/api/revenue-prediction/predict-next-months?months=3" \
  -H "Authorization: Bearer $TOKEN" > forecast.json
```

### Scenario 2: So sánh dự báo vs thực tế

```bash
# Dự báo cho tháng hiện tại
CURRENT_MONTH=$(date +%m)
CURRENT_YEAR=$(date +%Y)

PREDICTED=$(curl -s -X GET "http://localhost:5080/api/revenue-prediction/predict?month=$CURRENT_MONTH&year=$CURRENT_YEAR" \
  -H "Authorization: Bearer $TOKEN" | jq '.predictedRevenue')

# Lấy doanh thu thực tế
ACTUAL=$(curl -s -X GET "http://localhost:5080/api/revenue-prediction/actual-revenue?month=$CURRENT_MONTH&year=$CURRENT_YEAR" \
  -H "Authorization: Bearer $TOKEN" | jq '.revenue')

echo "Dự báo: $PREDICTED VND"
echo "Thực tế: $ACTUAL VND"
```

---

## Lưu ý quan trọng

1. **Token hết hạn**: Token thường có thời gian hết hạn. Nếu gặp lỗi 401, hãy đăng nhập lại để lấy token mới.

2. **Dữ liệu tối thiểu**: Cần ít nhất 2 tháng dữ liệu để huấn luyện mô hình.

3. **Độ chính xác**: R² score > 0.7 được coi là tốt. Nếu thấp hơn, cần:

   - Thêm dữ liệu huấn luyện
   - Kiểm tra dữ liệu có bất thường không
   - Xem xét các yếu tố khác ảnh hưởng doanh thu

4. **Huấn luyện lại định kỳ**: Nên huấn luyện lại mô hình mỗi tuần/tháng để có dự báo chính xác nhất.
