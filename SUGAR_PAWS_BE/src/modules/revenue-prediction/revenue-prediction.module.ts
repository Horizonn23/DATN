import { Module } from '@nestjs/common';
import { RevenuePredictionController } from './revenue-prediction.controller';
import { RevenuePredictionService } from './revenue-prediction.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [RevenuePredictionController],
  providers: [RevenuePredictionService, PrismaService],
  exports: [RevenuePredictionService],
})
export class RevenuePredictionModule {}
