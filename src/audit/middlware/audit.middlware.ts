import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuditRequest } from 'src/types/express';
// import { getSelectFields } from './audit.utils';
import { EntityRepositoryMap } from 'src/utils/repository.maps';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private readonly repoMap: EntityRepositoryMap) {}

  async use(req: AuditRequest, res: Response, next: NextFunction) {
    if (this.requiresOldValues(req)) {
      await this.prepareOldValues(req);
    }

    next();
  }

  private requiresOldValues(req: AuditRequest): boolean {
    return (
      ['PATCH', 'PUT', 'DELETE'].includes(req.method) &&
      this.getIdFromPath(req._parsedUrl.path) !== undefined
    );
  }

  private async prepareOldValues(req: AuditRequest): Promise<void> {
    try {
      const entityType = this.getEntityTypeFromPath(req._parsedUrl.path);
      const repo = this.repoMap.getRepository(entityType);
      console.log('is repo null?', repo === null);

      if (repo) {
        req['oldValues'] = await repo.findOne({
          where: { id: this.getIdFromPath(req._parsedUrl.path) },
          //   select: getSelectFields(entityType),
          //specify fields to select if needed in the future
        });

        this.sanitizeSensitiveFields(req.oldValues, entityType);
      }
    } catch (error) {
      console.error('AuditMiddleware failed:', error);
      req.oldValues = null;
    }
  }

  private getEntityTypeFromPath(path: string): string {
    //special for  livestock-types
    if (path.startsWith('/livestock-types/')) {
      return path.split('/')[2]?.toLowerCase(); // e.g. '/livestock-types/species' → 'species'
    } else return path.split('/')[1]?.toLowerCase(); // e.g. '/users/123' → 'users'
  }

  private sanitizeSensitiveFields(data: any, entityType: string): void {
    const sensitiveFields = {
      users: ['password', 'token'],
      markets: ['apiKey'],
      // Add other entities...
    };

    sensitiveFields[entityType]?.forEach((field) => {
      if (data?.[field]) data[field] = '*****';
    });
  }
  private getIdFromPath(path: string): string | undefined {
    // e.g. /users/123 → 123
    const match = path.match(/\/\w+\/(\d+)/);
    return match ? match[1] : undefined;
  }
}
