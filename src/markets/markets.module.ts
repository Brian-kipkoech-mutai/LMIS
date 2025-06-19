import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketsService } from './markets.service';
import { Market } from './markets.entity';
import { MarketsController } from './markets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketsService],
  controllers: [MarketsController],
})
export class MarketsModule {}
