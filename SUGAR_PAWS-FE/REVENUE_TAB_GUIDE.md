# Revenue Prediction Tab - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

Tab Revenue đã được tạo thành công trong phần Admin Dashboard. Tab này sử dụng Machine Learning để dự báo doanh thu theo tháng dựa trên dữ liệu lịch sử.

## 🎯 Tính Năng

### 1. Thống Kê Tổng Quan

- **Current Month Revenue**: Doanh thu tháng hiện tại
- **Next Month Prediction**: Dự báo doanh thu tháng tới
- **Average Monthly Revenue**: Doanh thu trung bình mỗi tháng
- **Model Accuracy**: Độ chính xác của mô hình (R² score)

### 2. Biểu Đồ Trực Quan

- Hiển thị dữ liệu doanh thu lịch sử và dự báo
- 3 loại biểu đồ: Area Chart, Line Chart, Bar Chart
- Tương tác với tooltip hiển thị thông tin chi tiết

### 3. Bảng Dự Báo Chi Tiết

- Hiển thị dự báo cho N tháng tiếp theo
- Độ tin cậy cho mỗi dự báo
- Màu sắc trực quan theo mức độ tin cậy:
  - 🟢 Xanh lá (≥80%): Excellent prediction
  - 🟡 Vàng (≥60%): Good prediction
  - 🔴 Đỏ (<60%): Fair prediction

### 4. Điều Khiển

- **Historical Months**: Chọn số tháng lịch sử (6, 12, 24 tháng)
- **Prediction Months**: Chọn số tháng dự báo (3, 6, 12 tháng)
- **Chart Type**: Chọn kiểu biểu đồ
- **Show Predictions**: Bật/tắt hiển thị dự báo

### 5. Quản Lý Mô Hình

- **Train Model**: Huấn luyện mô hình với dữ liệu mới
- **Refresh**: Làm mới dữ liệu
- **Model Status**: Hiển thị trạng thái và độ chính xác của mô hình

## 🚀 Hướng Dẫn Sử Dụng

### Bước 1: Chuẩn Bị Dữ Liệu (Backend)

```bash
# Di chuyển vào thư mục backend
cd SUGAR_PAWS_BE

# Seed dữ liệu đơn hàng mẫu (tạo 343 đơn hàng cho 12 tháng)
npm run seed:orders

# Khởi động server backend
npm run dev
```

### Bước 2: Khởi Động Frontend

```bash
# Di chuyển vào thư mục frontend
cd SUGAR_PAWS-FE

# Cài đặt package recharts (nếu chưa có)
npm install recharts

# Khởi động frontend
npm run dev
```

### Bước 3: Truy Cập Tab Revenue

1. Mở trình duyệt và truy cập: `http://localhost:3000`
2. Đăng nhập với tài khoản Admin
3. Nhấn vào tab **Revenue** trên thanh điều hướng
4. Nếu mô hình chưa được huấn luyện, nhấn nút **Train Model**

### Bước 4: Khám Phá Các Tính Năng

1. **Xem thống kê tổng quan**: Các card thống kê hiển thị ở phía trên
2. **Tương tác với biểu đồ**: Hover chuột lên biểu đồ để xem chi tiết
3. **Điều chỉnh tham số**: Thay đổi số tháng lịch sử và dự báo
4. **Chuyển đổi kiểu biểu đồ**: Chọn Area, Line hoặc Bar Chart
5. **Xem bảng chi tiết**: Cuộn xuống để xem bảng dự báo chi tiết

## 📊 Giải Thích Kỹ Thuật

### Machine Learning Model

- Sử dụng **Linear Regression** để dự báo doanh thu
- Độ chính xác được đo bằng **R² Score**:
  - R² ≥ 0.8: Xuất sắc
  - R² ≥ 0.6: Tốt
  - R² < 0.6: Trung bình

### API Endpoints

- `POST /api/revenue-prediction/train`: Huấn luyện mô hình
- `GET /api/revenue-prediction/model-info`: Lấy thông tin mô hình
- `GET /api/revenue-prediction/historical-data?months=12`: Lấy dữ liệu lịch sử
- `GET /api/revenue-prediction/predict-next-months?months=6`: Dự báo N tháng tiếp theo

## 📁 Cấu Trúc File

```
SUGAR_PAWS-FE/src/
├── api/service/
│   └── revenuePredictionService.ts       # Service gọi API
├── hooks/queries/
│   └── useRevenuePrediction.ts           # React Query hooks
└── app/(root)/admin/revenue/
    ├── page.tsx                          # Trang chính
    ├── RevenueStatistics.tsx             # Component thống kê
    └── RevenuePredictionChart.tsx        # Component biểu đồ
```

## 🎨 Thiết Kế

Tab Revenue được thiết kế phù hợp với phong cách của dự án:

- Gradient màu từ blue đến purple
- Card với shadow và hover effect
- Border màu theo theme
- Responsive design cho mọi kích thước màn hình

## ⚠️ Lưu Ý

1. **Dữ liệu tối thiểu**: Cần ít nhất 3 tháng dữ liệu để huấn luyện mô hình
2. **Độ chính xác**: Càng nhiều dữ liệu lịch sử, độ chính xác càng cao
3. **Làm mới mô hình**: Nên huấn luyện lại mô hình khi có dữ liệu mới
4. **Bảo mật**: Các API đang ở chế độ Public để test, nhớ thêm authentication khi deploy

## 🔧 Troubleshooting

### Không có dữ liệu hiển thị

- Kiểm tra backend có đang chạy không
- Seed dữ liệu bằng: `npm run seed:orders` (trong SUGAR_PAWS_BE)
- Refresh trang và nhấn nút Refresh

### Model chưa được huấn luyện

- Nhấn nút **Train Model**
- Đợi vài giây để mô hình huấn luyện
- Kiểm tra toast notification xác nhận thành công

### Lỗi API

- Kiểm tra console browser để xem lỗi chi tiết
- Đảm bảo backend đang chạy ở port 5080
- Kiểm tra file `.env` trong frontend

## 🚀 Nâng Cấp Trong Tương Lai

1. **Export Report**: Xuất báo cáo dự báo ra PDF/Excel
2. **Multiple Models**: So sánh nhiều mô hình ML khác nhau
3. **Real-time Updates**: Cập nhật real-time khi có đơn hàng mới
4. **Advanced Filters**: Lọc theo danh mục sản phẩm, khu vực
5. **Seasonal Trends**: Phân tích xu hướng theo mùa
