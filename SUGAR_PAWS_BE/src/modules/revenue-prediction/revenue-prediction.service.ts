import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { SimpleLinearRegression } from 'ml-regression-simple-linear';
import {
  RevenueDataPoint,
  PredictionResult,
  TrainingResult,
} from './dto/revenue-prediction.dto';

@Injectable()
export class RevenuePredictionService {
  private readonly logger = new Logger(RevenuePredictionService.name);
  private model: SimpleLinearRegression | null = null;
  private trainingData: RevenueDataPoint[] = [];

  constructor(private prisma: PrismaService) {}

  /**
   * Lấy dữ liệu doanh thu theo tháng từ database
   */
  async getHistoricalRevenueData(
    monthsBack: number = 12,
  ): Promise<RevenueDataPoint[]> {
    try {
      // Lấy tất cả các đơn hàng đã hoàn thành
      const orders = await this.prisma.order.findMany({
        where: {
          status: {
            in: ['COMPLETED', 'DELIVERED'],
          },
          completedAt: {
            not: null,
          },
        },
        include: {
          orderItems: {
            include: {
              productDetail: true,
            },
          },
        },
        orderBy: {
          completedAt: 'asc',
        },
      });

      // Group orders by month and year
      const revenueByMonth = new Map<string, RevenueDataPoint>();

      orders.forEach((order) => {
        const date = order.completedAt || order.createdAt;
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const key = `${year}-${month}`;

        // Tính tổng doanh thu của đơn hàng
        const orderRevenue = order.orderItems.reduce((sum, item) => {
          return sum + item.productDetail.price * item.quantity;
        }, 0);

        if (!revenueByMonth.has(key)) {
          revenueByMonth.set(key, {
            month,
            year,
            revenue: 0,
            orderCount: 0,
          });
        }

        const existing = revenueByMonth.get(key)!;
        existing.revenue += orderRevenue;
        existing.orderCount += 1;
      });

      // Chuyển đổi Map thành Array và sắp xếp theo thời gian
      const revenueData = Array.from(revenueByMonth.values()).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });

      // Lấy n tháng gần nhất
      return revenueData.slice(-monthsBack);
    } catch (error) {
      this.logger.error('Error fetching historical revenue data', error);
      throw new BadRequestException('Không thể lấy dữ liệu doanh thu lịch sử');
    }
  }

  /**
   * Huấn luyện mô hình dự báo
   */
  async trainModel(monthsToTrain: number = 12): Promise<TrainingResult> {
    try {
      // Lấy dữ liệu lịch sử
      this.trainingData = await this.getHistoricalRevenueData(monthsToTrain);

      if (this.trainingData.length < 2) {
        throw new BadRequestException(
          'Không đủ dữ liệu để huấn luyện mô hình (cần ít nhất 2 điểm dữ liệu)',
        );
      }

      // Chuẩn bị dữ liệu cho mô hình
      // X: tháng thứ bao nhiêu kể từ điểm bắt đầu
      // Y: doanh thu
      const x: number[] = [];
      const y: number[] = [];

      this.trainingData.forEach((dataPoint, index) => {
        x.push(index + 1); // Tháng thứ 1, 2, 3, ...
        y.push(dataPoint.revenue);
      });

      // Huấn luyện mô hình
      this.model = new SimpleLinearRegression(x, y);

      // Tính R² score để đánh giá độ chính xác
      const r2Score = this.calculateR2Score(x, y);

      this.logger.log(
        `Model trained successfully with ${this.trainingData.length} data points`,
      );
      this.logger.log(`R² Score: ${r2Score}`);
      this.logger.log(
        `Slope: ${this.model.slope}, Intercept: ${this.model.intercept}`,
      );

      return {
        success: true,
        message: 'Mô hình đã được huấn luyện thành công',
        dataPoints: this.trainingData.length,
        slope: this.model.slope,
        intercept: this.model.intercept,
        r2Score,
      };
    } catch (error) {
      this.logger.error('Error training model', error);
      throw error;
    }
  }

  /**
   * Dự báo doanh thu cho một tháng cụ thể
   */
  async predictRevenue(
    month: number,
    year?: number,
  ): Promise<PredictionResult> {
    if (!this.model || this.trainingData.length === 0) {
      // Tự động huấn luyện mô hình nếu chưa có
      await this.trainModel();
    }

    if (!this.model) {
      throw new BadRequestException('Không thể khởi tạo mô hình dự báo');
    }

    // Xác định năm dự báo
    const currentYear = new Date().getFullYear();
    const targetYear = year || currentYear;

    // Tính số tháng từ điểm bắt đầu
    const firstDataPoint = this.trainingData[0];
    const monthsFromStart =
      (targetYear - firstDataPoint.year) * 12 +
      (month - firstDataPoint.month) +
      1;

    // Dự báo
    const predictedRevenue = this.model.predict(monthsFromStart);

    // Tính độ tin cậy dựa trên R² score
    const x = this.trainingData.map((_, index) => index + 1);
    const y = this.trainingData.map((d) => d.revenue);
    const r2Score = this.calculateR2Score(x, y);

    return {
      predictedRevenue: Math.max(0, Math.round(predictedRevenue)), // Không cho phép doanh thu âm
      month,
      year: targetYear,
      confidence: r2Score,
      modelAccuracy: r2Score,
    };
  }

  /**
   * Dự báo doanh thu cho nhiều tháng tiếp theo
   */
  async predictNextMonths(numberOfMonths: number): Promise<PredictionResult[]> {
    if (!this.model || this.trainingData.length === 0) {
      await this.trainModel();
    }

    const predictions: PredictionResult[] = [];
    const lastDataPoint = this.trainingData[this.trainingData.length - 1];

    let currentMonth = lastDataPoint.month;
    let currentYear = lastDataPoint.year;

    for (let i = 1; i <= numberOfMonths; i++) {
      // Tăng tháng
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }

      const prediction = await this.predictRevenue(currentMonth, currentYear);
      predictions.push(prediction);
    }

    return predictions;
  }

  /**
   * Lấy thông tin về mô hình hiện tại
   */
  getModelInfo() {
    if (!this.model) {
      return {
        isTrained: false,
        message: 'Mô hình chưa được huấn luyện',
      };
    }

    const x = this.trainingData.map((_, index) => index + 1);
    const y = this.trainingData.map((d) => d.revenue);
    const r2Score = this.calculateR2Score(x, y);

    return {
      isTrained: true,
      dataPoints: this.trainingData.length,
      slope: this.model.slope,
      intercept: this.model.intercept,
      r2Score,
      trainingPeriod: {
        from: {
          month: this.trainingData[0].month,
          year: this.trainingData[0].year,
        },
        to: {
          month: this.trainingData[this.trainingData.length - 1].month,
          year: this.trainingData[this.trainingData.length - 1].year,
        },
      },
    };
  }

  /**
   * Tính R² score (coefficient of determination)
   */
  private calculateR2Score(x: number[], y: number[]): number {
    if (!this.model) return 0;

    // Tính giá trị trung bình của y
    const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;

    // Tính tổng bình phương của phần dư (SS_res)
    let ssRes = 0;
    // Tính tổng bình phương toàn phần (SS_tot)
    let ssTot = 0;

    for (let i = 0; i < x.length; i++) {
      const predicted = this.model.predict(x[i]);
      ssRes += Math.pow(y[i] - predicted, 2);
      ssTot += Math.pow(y[i] - yMean, 2);
    }

    // R² = 1 - (SS_res / SS_tot)
    const r2 = 1 - ssRes / ssTot;
    return Math.max(0, Math.min(1, r2)); // Giới hạn trong khoảng [0, 1]
  }

  /**
   * Lấy dữ liệu doanh thu thực tế để so sánh
   */
  async getActualRevenue(month: number, year: number): Promise<number> {
    const orders = await this.prisma.order.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'DELIVERED'],
        },
        completedAt: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1),
        },
      },
      include: {
        orderItems: {
          include: {
            productDetail: true,
          },
        },
      },
    });

    return orders.reduce((total, order) => {
      const orderRevenue = order.orderItems.reduce((sum, item) => {
        return sum + item.productDetail.price * item.quantity;
      }, 0);
      return total + orderRevenue;
    }, 0);
  }
}
