import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PredictRevenueDto {
  @ApiProperty({
    description: 'Tháng cần dự báo (1-12)',
    example: 1,
    minimum: 1,
    maximum: 12,
  })
  @IsInt()
  @Min(1)
  month: number;

  @ApiPropertyOptional({
    description: 'Năm cần dự báo',
    example: 2026,
  })
  @IsInt()
  @IsOptional()
  year?: number;
}

export class TrainModelDto {
  @ApiPropertyOptional({
    description: 'Số tháng dữ liệu lịch sử để huấn luyện',
    example: 12,
    minimum: 2,
  })
  @IsInt()
  @Min(2)
  @IsOptional()
  monthsToTrain?: number;
}

export class RevenueDataPoint {
  month: number;
  year: number;
  revenue: number;
  orderCount: number;
}

export class PredictionResult {
  predictedRevenue: number;
  month: number;
  year: number;
  confidence: number;
  modelAccuracy: number;
}

export class TrainingResult {
  success: boolean;
  message: string;
  dataPoints: number;
  slope: number;
  intercept: number;
  r2Score: number;
}
