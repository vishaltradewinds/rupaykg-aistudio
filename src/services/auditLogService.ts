import { db } from '../db/index.ts';
import { operational_logs } from '../db/schema.ts';
import { desc } from 'drizzle-orm';
import crypto from 'crypto';

export class AuditLogService {
  static formatLog(l: any) {
    if (!l) return null;
    return {
      id: l.id,
      level: l.level,
      category: l.category,
      event: l.category,
      message: l.message,
      details: l.message,
      userId: l.userId,
      metadata: l.metadata,
      timestamp: l.timestamp ? new Date(l.timestamp).toISOString() : new Date().toISOString(),
    };
  }

  static async log(category: string, message: string, level: string = 'INFO', userId?: string, metadata: any = {}) {
    const id = `log_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const mapped = {
      id,
      level,
      category,
      message,
      userId: userId || null,
      metadata: metadata || {},
      timestamp: new Date(),
    };

    await db.insert(operational_logs).values(mapped).onConflictDoNothing();
    return this.formatLog(mapped);
  }

  static async getLogs(limit: number = 100) {
    const rows = await db.select().from(operational_logs).orderBy(desc(operational_logs.timestamp)).limit(limit);
    return rows.map(r => this.formatLog(r));
  }
}


