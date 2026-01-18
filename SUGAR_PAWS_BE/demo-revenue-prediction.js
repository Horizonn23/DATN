/**
 * Quick Demo Script - Revenue Prediction với dữ liệu đã seed
 *
 * Script này sẽ:
 * 1. Hiển thị dữ liệu lịch sử đã seed
 * 2. Huấn luyện mô hình
 * 3. Dự báo doanh thu cho các tháng tiếp theo
 *
 * Chạy: node demo-revenue-prediction.js YOUR_ADMIN_TOKEN
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5080';
const TOKEN = process.argv[2] || 'YOUR_ADMIN_TOKEN';

if (TOKEN === 'YOUR_ADMIN_TOKEN') {
  console.log('❌ Vui lòng cung cấp token admin:');
  console.log('   node demo-revenue-prediction.js YOUR_TOKEN');
  console.log('\nCách lấy token:');
  console.log('1. POST http://localhost:5080/api/auth/login');
  console.log(
    '2. Body: {"email": "admin@example.com", "password": "your-password"}',
  );
  console.log('3. Copy access_token từ response\n');
  process.exit(1);
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

async function demo() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     DEMO DỰ BÁO DOANH THU - SUGAR PAWS                    ║');
  console.log(
    '╚════════════════════════════════════════════════════════════╝\n',
  );

  try {
    // 1. Kiểm tra dữ liệu lịch sử
    console.log('📊 BƯỚC 1: Lấy dữ liệu doanh thu lịch sử (12 tháng)\n');
    const historicalData = await api.get(
      '/revenue-prediction/historical-data?months=12',
    );

    console.log('┌─────────────┬───────────────┬──────────────────┐');
    console.log('│    Tháng    │  Số đơn hàng  │  Doanh thu       │');
    console.log('├─────────────┼───────────────┼──────────────────┤');

    historicalData.data.forEach((item) => {
      const monthStr = `${item.month}/${item.year}`.padEnd(11);
      const ordersStr = item.orderCount.toString().padStart(12);
      const revenueStr = formatVND(item.revenue).padStart(16);
      console.log(`│ ${monthStr} │ ${ordersStr} │ ${revenueStr} │`);
    });

    console.log('└─────────────┴───────────────┴──────────────────┘\n');

    const totalRevenue = historicalData.data.reduce(
      (sum, item) => sum + item.revenue,
      0,
    );
    const totalOrders = historicalData.data.reduce(
      (sum, item) => sum + item.orderCount,
      0,
    );
    const avgRevenue = totalRevenue / historicalData.data.length;

    console.log(`📈 Tổng doanh thu 12 tháng: ${formatVND(totalRevenue)}`);
    console.log(`📦 Tổng số đơn hàng: ${totalOrders} đơn`);
    console.log(`💰 Doanh thu trung bình/tháng: ${formatVND(avgRevenue)}\n`);

    // 2. Huấn luyện mô hình
    console.log('🤖 BƯỚC 2: Huấn luyện mô hình Machine Learning\n');
    const training = await api.post('/revenue-prediction/train', {
      monthsToTrain: 12,
    });

    console.log(`✅ ${training.data.message}`);
    console.log(`   📊 Số điểm dữ liệu: ${training.data.dataPoints}`);
    console.log(
      `   📈 Slope (tốc độ tăng): ${formatVND(training.data.slope)}/tháng`,
    );
    console.log(
      `   📍 Intercept (cơ sở): ${formatVND(training.data.intercept)}`,
    );
    console.log(
      `   🎯 Độ chính xác (R²): ${(training.data.r2Score * 100).toFixed(2)}%`,
    );

    let accuracyText = '';
    if (training.data.r2Score > 0.8) {
      accuracyText = '🟢 Xuất sắc - Mô hình dự báo rất chính xác!';
    } else if (training.data.r2Score > 0.6) {
      accuracyText = '🟡 Tốt - Mô hình dự báo khá chính xác';
    } else {
      accuracyText = '🔴 Trung bình - Cần thêm dữ liệu để cải thiện';
    }
    console.log(`   ${accuracyText}\n`);

    // 3. Dự báo cho 6 tháng tiếp theo
    console.log('🔮 BƯỚC 3: Dự báo doanh thu 6 tháng tiếp theo\n');
    const predictions = await api.get(
      '/revenue-prediction/predict-next-months?months=6',
    );

    console.log('┌─────────────┬──────────────────┬────────────────┐');
    console.log('│    Tháng    │  Doanh thu dự báo│  Độ tin cậy    │');
    console.log('├─────────────┼──────────────────┼────────────────┤');

    predictions.data.forEach((pred) => {
      const monthStr = `${pred.month}/${pred.year}`.padEnd(11);
      const revenueStr = formatVND(pred.predictedRevenue).padStart(16);
      const confidenceStr = `${(pred.confidence * 100).toFixed(1)}%`.padStart(
        14,
      );
      console.log(`│ ${monthStr} │ ${revenueStr} │ ${confidenceStr} │`);
    });

    console.log('└─────────────┴──────────────────┴────────────────┘\n');

    const totalPredicted = predictions.data.reduce(
      (sum, p) => sum + p.predictedRevenue,
      0,
    );
    console.log(
      `💎 Tổng doanh thu dự báo 6 tháng: ${formatVND(totalPredicted)}\n`,
    );

    // 4. Phân tích xu hướng
    console.log('📈 BƯỚC 4: Phân tích xu hướng\n');

    const firstMonthRevenue = historicalData.data[0].revenue;
    const lastMonthRevenue =
      historicalData.data[historicalData.data.length - 1].revenue;
    const growthRate =
      ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue) * 100;

    console.log(`📊 Phân tích 12 tháng vừa qua:`);
    console.log(`   • Tháng đầu: ${formatVND(firstMonthRevenue)}`);
    console.log(`   • Tháng cuối: ${formatVND(lastMonthRevenue)}`);
    console.log(`   • Tăng trưởng: ${growthRate.toFixed(2)}%`);
    console.log(
      `   • Xu hướng: ${growthRate > 0 ? '📈 Tăng trưởng' : '📉 Giảm'}\n`,
    );

    const nextMonthPrediction = predictions.data[0];
    const expectedGrowth =
      ((nextMonthPrediction.predictedRevenue - lastMonthRevenue) /
        lastMonthRevenue) *
      100;

    console.log(
      `🔮 Dự báo tháng tiếp theo (${nextMonthPrediction.month}/${nextMonthPrediction.year}):`,
    );
    console.log(
      `   • Doanh thu: ${formatVND(nextMonthPrediction.predictedRevenue)}`,
    );
    console.log(
      `   • So với tháng trước: ${expectedGrowth > 0 ? '+' : ''}${expectedGrowth.toFixed(2)}%`,
    );
    console.log(
      `   • Xu hướng: ${expectedGrowth > 0 ? '📈 Tiếp tục tăng' : '📉 Có thể giảm'}\n`,
    );

    // 5. Kết luận
    console.log(
      '╔════════════════════════════════════════════════════════════╗',
    );
    console.log(
      '║                    KẾT LUẬN                                ║',
    );
    console.log(
      '╚════════════════════════════════════════════════════════════╝\n',
    );

    console.log('✅ Mô hình Machine Learning đã được huấn luyện thành công!');
    console.log(
      `✅ Độ chính xác: ${(training.data.r2Score * 100).toFixed(2)}% (${accuracyText.split(' - ')[1]})`,
    );
    console.log(`✅ Dự báo cho 6 tháng tới đã sẵn sàng`);
    console.log(
      `✅ Doanh thu dự kiến tăng ${formatVND(training.data.slope)}/tháng\n`,
    );

    console.log('💡 Khuyến nghị:');
    if (training.data.slope > 0) {
      console.log('   • Duy trì chiến lược marketing hiện tại');
      console.log('   • Chuẩn bị tăng cường kho hàng cho xu hướng tăng trưởng');
      console.log('   • Đầu tư vào customer retention');
    } else {
      console.log('   • Cần xem xét lại chiến lược kinh doanh');
      console.log('   • Tăng cường marketing và khuyến mãi');
      console.log('   • Phân tích feedback khách hàng');
    }

    console.log('\n🎉 Demo hoàn tất!\n');
  } catch (error) {
    console.error('\n❌ Lỗi:', error.response?.data?.message || error.message);
    if (error.response?.status === 401) {
      console.error('\n🔒 Token không hợp lệ hoặc đã hết hạn!');
      console.error('Vui lòng đăng nhập lại để lấy token mới.\n');
    }
  }
}

demo();
