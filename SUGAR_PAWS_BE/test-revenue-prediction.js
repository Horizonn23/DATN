/**
 * Script để test các API dự báo doanh thu
 *
 * Hướng dẫn sử dụng:
 * 1. Đảm bảo server đang chạy: npm run dev
 * 2. Thay YOUR_ADMIN_TOKEN bằng token của admin
 * 3. Chạy: node test-revenue-prediction.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5080';
const TOKEN = 'YOUR_ADMIN_TOKEN'; // Thay bằng token admin thực tế

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

async function testRevenuePrediction() {
  console.log('=== TEST MODULE DỰ BÁO DOANH THU ===\n');

  try {
    // 1. Kiểm tra thông tin mô hình
    console.log('1. Kiểm tra thông tin mô hình hiện tại...');
    const modelInfo = await api.get('/revenue-prediction/model-info');
    console.log('Kết quả:', JSON.stringify(modelInfo.data, null, 2));
    console.log('\n---\n');

    // 2. Lấy dữ liệu lịch sử
    console.log('2. Lấy dữ liệu doanh thu lịch sử (12 tháng gần nhất)...');
    const historicalData = await api.get(
      '/revenue-prediction/historical-data?months=12',
    );
    console.log('Số điểm dữ liệu:', historicalData.data.length);
    console.log(
      'Dữ liệu mẫu:',
      JSON.stringify(historicalData.data.slice(0, 3), null, 2),
    );
    console.log('\n---\n');

    // 3. Huấn luyện mô hình
    console.log('3. Huấn luyện mô hình với dữ liệu 12 tháng...');
    const training = await api.post('/revenue-prediction/train', {
      monthsToTrain: 12,
    });
    console.log('Kết quả huấn luyện:', JSON.stringify(training.data, null, 2));
    console.log('\n---\n');

    // 4. Dự báo cho tháng tiếp theo
    const nextMonth = new Date().getMonth() + 2; // Tháng tiếp theo
    const nextYear = new Date().getFullYear();
    console.log(`4. Dự báo doanh thu cho tháng ${nextMonth}/${nextYear}...`);
    const prediction = await api.get(
      `/revenue-prediction/predict?month=${nextMonth}&year=${nextYear}`,
    );
    console.log('Kết quả dự báo:', JSON.stringify(prediction.data, null, 2));
    console.log('\n---\n');

    // 5. Dự báo cho 6 tháng tiếp theo
    console.log('5. Dự báo doanh thu cho 6 tháng tiếp theo...');
    const nextMonths = await api.get(
      '/revenue-prediction/predict-next-months?months=6',
    );
    console.log('Kết quả dự báo:');
    nextMonths.data.forEach((pred, index) => {
      console.log(
        `  Tháng ${pred.month}/${pred.year}: ${pred.predictedRevenue.toLocaleString('vi-VN')} VND (Độ tin cậy: ${(pred.confidence * 100).toFixed(2)}%)`,
      );
    });
    console.log('\n---\n');

    // 6. So sánh doanh thu thực tế vs dự báo (tháng trước)
    const lastMonth = new Date().getMonth() || 12;
    const lastYear =
      lastMonth === 12
        ? new Date().getFullYear() - 1
        : new Date().getFullYear();
    console.log(
      `6. So sánh doanh thu thực tế vs dự báo cho tháng ${lastMonth}/${lastYear}...`,
    );

    const actual = await api.get(
      `/revenue-prediction/actual-revenue?month=${lastMonth}&year=${lastYear}`,
    );
    const predicted = await api.get(
      `/revenue-prediction/predict?month=${lastMonth}&year=${lastYear}`,
    );

    console.log(
      'Doanh thu thực tế:',
      actual.data.revenue.toLocaleString('vi-VN'),
      'VND',
    );
    console.log(
      'Doanh thu dự báo:',
      predicted.data.predictedRevenue.toLocaleString('vi-VN'),
      'VND',
    );

    const error = Math.abs(
      actual.data.revenue - predicted.data.predictedRevenue,
    );
    const errorPercent = ((error / actual.data.revenue) * 100).toFixed(2);
    console.log(
      'Sai số:',
      error.toLocaleString('vi-VN'),
      `VND (${errorPercent}%)`,
    );

    console.log('\n=== HOÀN THÀNH TẤT CẢ TESTS ===');
  } catch (error) {
    console.error('Lỗi:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.error('\n⚠️  Lỗi xác thực! Vui lòng:');
      console.error('1. Đăng nhập với tài khoản ADMIN');
      console.error('2. Lấy token từ response');
      console.error('3. Thay thế YOUR_ADMIN_TOKEN trong file này');
    }
  }
}

// Chạy tests
testRevenuePrediction();
