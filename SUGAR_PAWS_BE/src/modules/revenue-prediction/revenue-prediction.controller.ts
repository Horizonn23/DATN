import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RevenuePredictionService } from './revenue-prediction.service';
import {
  PredictRevenueDto,
  TrainModelDto,
  PredictionResult,
  TrainingResult,
} from './dto/revenue-prediction.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RoleGuard } from '../../auth/role.guard';
import { Roles } from '../../auth/roles.decorator';
import { Public } from '../../auth/public.decorator';

@ApiTags('Revenue Prediction')
@Controller('revenue-prediction')
@Public()
export class RevenuePredictionController {
  constructor(
    private readonly revenuePredictionService: RevenuePredictionService,
  ) {}

  @Post('train')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Huấn luyện mô hình dự báo doanh thu' })
  @ApiResponse({
    status: 200,
    description: 'Mô hình đã được huấn luyện thành công',
  })
  async trainModel(@Body() dto: TrainModelDto): Promise<TrainingResult> {
    return this.revenuePredictionService.trainModel(dto.monthsToTrain || 12);
  }

  @Get('predict')
  @ApiOperation({ summary: 'Dự báo doanh thu cho một tháng cụ thể' })
  @ApiResponse({
    status: 200,
    description: 'Dự báo doanh thu thành công',
  })
  async predictRevenue(
    @Query() dto: PredictRevenueDto,
  ): Promise<PredictionResult> {
    return this.revenuePredictionService.predictRevenue(dto.month, dto.year);
  }

  @Get('predict-next-months')
  @ApiOperation({ summary: 'Dự báo doanh thu cho N tháng tiếp theo' })
  @ApiResponse({
    status: 200,
    description: 'Dự báo doanh thu cho nhiều tháng thành công',
  })
  async predictNextMonths(
    @Query('months') months: number = 3,
  ): Promise<PredictionResult[]> {
    return this.revenuePredictionService.predictNextMonths(Number(months));
  }

  @Get('model-info')
  @ApiOperation({ summary: 'Lấy thông tin về mô hình hiện tại' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin mô hình',
  })
  async getModelInfo() {
    return this.revenuePredictionService.getModelInfo();
  }

  @Get('historical-data')
  @ApiOperation({ summary: 'Lấy dữ liệu doanh thu lịch sử' })
  @ApiResponse({
    status: 200,
    description: 'Dữ liệu doanh thu lịch sử',
  })
  async getHistoricalData(@Query('months') months: number = 12) {
    return this.revenuePredictionService.getHistoricalRevenueData(
      Number(months),
    );
  }

  @Get('actual-revenue')
  @ApiOperation({ summary: 'Lấy doanh thu thực tế của một tháng' })
  @ApiResponse({
    status: 200,
    description: 'Doanh thu thực tế',
  })
  async getActualRevenue(
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    const revenue = await this.revenuePredictionService.getActualRevenue(
      Number(month),
      Number(year),
    );
    return {
      month: Number(month),
      year: Number(year),
      revenue,
    };
  }
}
