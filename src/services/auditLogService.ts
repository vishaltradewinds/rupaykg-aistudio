import { db } from '../db/index.ts';
import { operational_logs } from '../db/schema.ts';
import { desc } from 'drizzle-orm';
import crypto from 'crypto';

export class AuditLogService {
  private static localLogs: any[] = [];

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

    this.localLogs.unshift(mapped);

    try {
      await db.insert(operational_logs).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in AuditLogService.log:', err);
    }
    return this.formatLog(mapped);
  }

  static async getLogs(limit: number = 100) {
    try {
      const rows = await db.select().from(operational_logs).orderBy(desc(operational_logs.timestamp)).limit(limit);
      if (rows && rows.length > 0) {
        return rows.map(r => this.formatLog(r));
      }
    } catch (err) {
      console.warn('DB read warning in AuditLogService.getLogs:', err);
    }
    return this.localLogs.slice(0, limit).map(l => this.formatLog(l));
  }
}


