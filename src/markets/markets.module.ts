import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketService } from './markets.service';
import { MarketController } from './markets.controller';
import { RegionsModule } from 'src/regions/regions.module';
import { Market } from './entities/market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market]), RegionsModule],
  providers: [MarketService],
  controllers: [MarketController],
})
export class MarketsModule {}
