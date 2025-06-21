import { Module } from '@nestjs/common';
import { DataSyncService } from './data-sync.service';
import { DataSyncController } from './data-sync.controller';

@Module({
  providers: [DataSyncService],
  controllers: [DataSyncController]
})
export class DataSyncModule {}
