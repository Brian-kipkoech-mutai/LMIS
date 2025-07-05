// audit/audit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditInterceptor } from './interceptors/audit.interceptor';
import { User } from 'src/users/entities/user.entity';
import { EntityRepositoryMap } from 'src/utils/repository.maps';
import { Market } from 'src/markets/entities/market.entity';
import { Region } from 'src/regions/entities/region.entity';
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog,User,Market, Region])],
  controllers: [AuditController],
  providers: [
    AuditService,
    AuditInterceptor, // Now properly included
    EntityRepositoryMap
  ],
  exports: [
    AuditService,
    AuditInterceptor, // Export if needed by other modules
    EntityRepositoryMap
  ],
})
export class AuditModule {}

