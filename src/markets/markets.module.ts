import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';

@Module({
  providers: [MarketsService]
})
export class MarketsModule {}
