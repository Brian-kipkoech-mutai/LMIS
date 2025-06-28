import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../audit.service';
import { Reflector } from '@nestjs/core';
import { getObjectDiff } from 'src/utils/audit.helpers';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly auditService: AuditService,
    private readonly reflector: Reflector,
  ) {}

  private mapMethodToAction(method: string): string | null {
    return (
      {
        POST: 'CREATE',
        PUT: 'UPDATE',
        PATCH: 'UPDATE',
        DELETE: 'DELETE',
        GET: null,
      }[method] || null
    );
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const auditConfig = this.reflector.get<{
      action?: string;
      entityType?: string;
    }>('audit', context.getHandler());

    const action =
      auditConfig?.action || this.mapMethodToAction(request.method);
    const entityType =
      auditConfig?.entityType ||
      context.getClass().name.replace('Controller', '').toUpperCase();

    if (!action) return next.handle();

    // add oldValues to request
      const oldValues = request.oldValues;
      console.log('Old Values from interceptor:', oldValues);

    return next.handle().pipe(
      tap(async (result) => {
        const { oldValues: finalOldValues, newValues: finalNewValues } =
          getObjectDiff(oldValues, result);

        await this.auditService.log({
          action,
          entityType,
          entityId: result?.id || request.params?.id,
          actor: request.user,
          request,
          oldValues: finalOldValues,
          newValues: finalNewValues || result, // Fallback to full object if no changes
        });
      }),
      catchError(async (error) => {
        await this.auditService.log({
          action,
          entityType,
          actor: request.user,
          request,
          oldValues,
          error,
        });
        throw error;
      }),
    );
  }
}
