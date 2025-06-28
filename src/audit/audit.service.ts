import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(options: {
    action: string;
    entityType: string;
    entityId?: string;
    actor: any;
    request: any;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    error?: Error;
  }) {
    const log = new AuditLog();

    log.action = options.action;
    log.entityType = options.entityType;
    log.entityId = options.entityId;
    log.actor = options.actor;
    log.oldValues = this.sanitize(options.oldValues);
    log.newValues = this.sanitize(options.newValues);
    log.ipAddress = options.request.ip;
    log.userAgent = options.request.headers['user-agent'];
    log.success = !options.error;
    log.errorMessage = options.error?.message;

    await this.repo.save(log);
  }

  async getLogs(filters: {
    action?: string;
    entityType?: string;
    actorId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }) {
    const query = this.repo
      .createQueryBuilder('log')
      .orderBy('log.timestamp', 'DESC');

    if (filters.action) {
      query.andWhere('log.action = :action', { action: filters.action });
    }

    if (filters.entityType) {
      query.andWhere('log.entityType = :entityType', {
        entityType: filters.entityType,
      });
    }

    if (filters.actorId) {
      query.andWhere("log.actor ->> 'id' = :actorId", {
        actorId: filters.actorId,
      });
    }

    if (filters.startDate) {
      query.andWhere('log.timestamp >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      query.andWhere('log.timestamp <= :endDate', {
        endDate: filters.endDate,
      });
    }

    if (filters.limit) {
      query.limit(filters.limit);
    }

    return query.getMany();
  }

  private sanitize(data: Record<string, any>|undefined) {
    if (!data) return data;
    const sensitive = ['password', 'token'];
    const sanitized = { ...data };
    sensitive.forEach((field) => {
      if (sanitized[field]) sanitized[field] = '*****';
    });
    return sanitized;
  }
}
