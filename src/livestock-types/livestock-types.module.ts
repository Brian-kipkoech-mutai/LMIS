import { Module } from '@nestjs/common';
import { LivestockTypesService } from './livestock-types.service';
import { LivestockTypesController } from './livestock-types.controller';

@Module({
  providers: [LivestockTypesService],
  controllers: [LivestockTypesController]
})
export class LivestockTypesModule {}
