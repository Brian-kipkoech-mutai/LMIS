import { Module } from '@nestjs/common';
import { LivestockTypesService } from './livestock-types.service';
import { LivestockTypesController } from './livestock-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Species } from './entities/species.entity';
import { Grade } from './entities/grade.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Species, Grade])],
  providers: [LivestockTypesService],
  controllers: [LivestockTypesController],
})
export class LivestockTypesModule {}
