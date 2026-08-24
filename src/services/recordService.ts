import { db } from '../db/index.ts';
import { records, carbon_projects } from '../db/schema.ts'; // assuming carbon_events doesn't exist yet, we'll create it
import { eq, desc } from 'drizzle-orm';

export class RecordService {
  static async addRecord(record: any) {
    // Map to DB schema
    const mapped = {
      id: record.id,
      userId: record.citizen_id || record.user_id || 'unknown',
      wasteType: record.waste_type || 'unknown',
      weightKg: record.weight_kg || 0,
      village: record.village || null,
      status: record.status || 'pending',
      mrvStatus: record.mrv_status || 'pending',
      mrvVerifiedBy: record.mrv_verified_by || null,
      totalValue: record.total_value || 0,
      cccAmountKg: record.ccc_amount_kg || 0,
      potentialCccValue: record.potential_ccc_value || 0,
      riskScore: record.risk_score || 0,
      evidenceUrls: record.evidence_urls || null,
      timestamp: new Date(record.timestamp || Date.now())
    };
    await db.insert(records).values(mapped).onConflictDoNothing();
    return mapped;
  }

  static async getRecord(id: string) {
    const result = await db.select().from(records).where(eq(records.id, id));
    return result[0];
  }

  static async updateRecord(id: string, updates: any) {
    await db.update(records).set(updates).where(eq(records.id, id));
  }

  static async getAllRecords() {
    return await db.select().from(records);
  }

  static async getUserRecords(userId: string) {
    return await db.select().from(records).where(eq(records.userId, userId));
  }
}
