import { MarketsModule } from 'src/markets/markets.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';

import { RegionsModule } from 'src/regions/regions.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RegionsModule, MarketsModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

