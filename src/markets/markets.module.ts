import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketService } from './markets.service';
import { MarketController } from './markets.controller';
import { RegionsModule } from 'src/regions/regions.module';
import { Market } from './entities/market.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market]),
    RegionsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [MarketService],
  controllers: [MarketController],
  exports: [MarketService],
})
export class MarketsModule {}
