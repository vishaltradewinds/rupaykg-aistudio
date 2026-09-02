import { db } from '../db/index.ts';
import { compliance_records } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class ComplianceService {
  static async addRecord(data: any) {
    const id = data.id || `comp_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const evidenceUrls = Array.isArray(data.evidence_urls || data.evidenceUrls)
      ? (data.evidence_urls || data.evidenceUrls)
      : [];
    const verifiedBy = data.verified_by || data.verifiedBy || null;
    const requestedStatus = data.status || 'PENDING';

    // A compliance record must not become authoritative merely because a caller
    // supplied a COMPLIANT status. Require an identifiable verifier and evidence.
    if (requestedStatus === 'COMPLIANT' && (!verifiedBy || evidenceUrls.length === 0)) {
      throw new Error('COMPLIANT compliance status requires verified_by and at least one evidence URL.');
    }

    const mapped = {
      id,
      entityId: data.entity_id || data.entityId || null,
      complianceType: data.compliance_type || data.complianceType || 'EPR_PLASTIC',
      reportingPeriod: data.reporting_period || data.reportingPeriod || null,
      status: requestedStatus,
      targetQuantity: Number(data.target_quantity || data.targetQuantity || 0),
      achievedQuantity: Number(data.achieved_quantity || data.achievedQuantity || 0),
      evidenceUrls,
      verifiedBy,
      metadata: data.metadata || {},
      createdAt: new Date(data.createdAt || data.created_at || Date.now()),
      updatedAt: new Date(data.updatedAt || data.updated_at || Date.now()),
    };

    await db.insert(compliance_records).values(mapped).onConflictDoNothing();
    return mapped;
  }

  static async getRecord(id: string) {
    const result = await db.select().from(compliance_records).where(eq(compliance_records.id, id));
    return result[0] || null;
  }

  static async getAllRecords() {
    return await db.select().from(compliance_records).orderBy(desc(compliance_records.createdAt));
  }

  static async updateRecord(id: string, updates: any) {
    await db.update(compliance_records).set({
      ...updates,
      updatedAt: new Date(),
    }).where(eq(compliance_records.id, id));
    return await this.getRecord(id);
  }

  static async getRecordsByGenerator(generatorId: string) {
    const records = await db.select().from(compliance_records).orderBy(desc(compliance_records.createdAt));
    return records.filter(r => r.entityId === generatorId || (r.metadata as any)?.generator_id === generatorId);
  }
}
