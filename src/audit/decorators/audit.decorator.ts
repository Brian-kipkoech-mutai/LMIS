import { SetMetadata } from '@nestjs/common';

export const Audit = (
  options:
    | {
        action?: string;
        entityType?: string;
      }
    | string,
) =>
  SetMetadata(
    'audit',
    typeof options === 'string' ? { action: options } : options,
  );
