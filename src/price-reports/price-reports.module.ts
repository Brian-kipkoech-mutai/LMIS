import { Module } from '@nestjs/common';
import { PriceReportsService } from './price-reports.service';
import { PriceReportsController } from './price-reports.controller';

@Module({
  providers: [PriceReportsService],
  controllers: [PriceReportsController]
})
export class PriceReportsModule {}
