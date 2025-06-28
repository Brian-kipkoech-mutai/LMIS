// src/types/express.d.ts
import { Request } from 'express';

export interface AuditRequest extends Request {
  oldValues?: any;
  _parsedUrl: {
    path: string;
  };
}
