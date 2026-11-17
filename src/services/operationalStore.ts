import { db, withDbRetry } from '../db/index.ts';
import { compliance_records, operational_logs, hedera_anchors } from '../db/schema.ts';
import { and, desc, eq } from 'drizzle-orm';
import crypto from 'crypto';

export type OperationalDocType =
  | 'GENERATOR_PROFILE'
  | 'GENERATOR_CONTRACT'
  | 'PICKUP_SCHEDULE'
  | 'CPCB_BWG_LOG'
  | 'VERIFIABLE_CREDENTIAL'
  | 'GUARDIAN_POLICY'
  | 'OFFSET_PROJECT'
  | 'OFFSET_PDD'
  | 'CCC_CERTIFICATE'
  | 'GREEN_BOND'
  | 'MARKET_ORDER'
  | 'CUSTOM_METHODOLOGY'
  | 'SYSTEM_CONFIG'
  | 'FACILITY_OUTPUT_CLAIM';

export class OperationalStore {
  static async listByType<T = any>(complianceType: OperationalDocType, entityId?: string): Promise<T[]> {
    if (!db) return [];
    const rows = await withDbRetry(() => {
      if (entityId) {
        return db
          .select()
          .from(compliance_records)
          .where(
            and(
              eq(compliance_records.complianceType, complianceType),
              eq(compliance_records.entityId, entityId)
            )
          )
          .orderBy(desc(compliance_records.createdAt));
      }
      return db
        .select()
        .from(compliance_records)
        .where(eq(compliance_records.complianceType, complianceType))
        .orderBy(desc(compliance_records.createdAt));
    });

    return rows.map((r: any) => ({
      id: r.id,
      ...(typeof r.metadata === 'object' && r.metadata !== null ? r.metadata : {}),
      status: (r.metadata as any)?.status ?? r.status,
    })) as T[];
  }

  static async getById<T = any>(complianceType: OperationalDocType, id: string): Promise<T | null> {
    if (!db || !id) return null;
    const rows = await withDbRetry(() =>
      db
        .select()
        .from(compliance_records)
        .where(and(eq(compliance_records.complianceType, complianceType), eq(compliance_records.id, id)))
        .limit(1)
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.id,
      ...(typeof r.metadata === 'object' && r.metadata !== null ? r.metadata : {}),
      status: (r.metadata as any)?.status ?? r.status,
    } as T;
  }

  static async upsert<T extends Record<string, any>>(
    complianceType: OperationalDocType,
    id: string,
    payload: T,
    options?: {
      entityId?: string | null;
      status?: string;
      targetQuantity?: number;
      achievedQuantity?: number;
      verifiedBy?: string | null;
      reportingPeriod?: string | null;
    }
  ): Promise<T & { id: string }> {
    if (!db) {
      throw new Error('PostgreSQL database connection unavailable.');
    }

    const now = new Date();
    const recordId = id || `${complianceType.toLowerCase()}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const doc = { ...payload, id: recordId };
    const status = options?.status ?? String(doc.status || 'ACTIVE');
    const entityId = options?.entityId ?? (doc.entityId || doc.generator_id || doc.project_id || doc.owner_id || null);

    const existing = await withDbRetry(() =>
      db
        .select({ id: compliance_records.id })
        .from(compliance_records)
        .where(and(eq(compliance_records.complianceType, complianceType), eq(compliance_records.id, recordId)))
        .limit(1)
    );

    if (existing.length > 0) {
      await withDbRetry(() =>
        db
          .update(compliance_records)
          .set({
            entityId: entityId ? String(entityId) : null,
            status,
            targetQuantity: options?.targetQuantity ?? (Number(doc.target_amount ?? doc.targetQuantity ?? 0) || 0),
            achievedQuantity: options?.achievedQuantity ?? (Number(doc.achievedQuantity ?? doc.quantity_kg ?? doc.weightKg ?? 0) || 0),
            verifiedBy: options?.verifiedBy ?? null,
            reportingPeriod: options?.reportingPeriod ?? null,
            metadata: doc,
            updatedAt: now,
          })
          .where(and(eq(compliance_records.complianceType, complianceType), eq(compliance_records.id, recordId)))
      );
    } else {
      await withDbRetry(() =>
        db.insert(compliance_records).values({
          id: recordId,
          entityId: entityId ? String(entityId) : null,
          complianceType,
          reportingPeriod: options?.reportingPeriod ?? null,
          status,
          targetQuantity: options?.targetQuantity ?? (Number(doc.target_amount ?? doc.targetQuantity ?? 0) || 0),
          achievedQuantity: options?.achievedQuantity ?? (Number(doc.achievedQuantity ?? doc.quantity_kg ?? doc.weightKg ?? 0) || 0),
          evidenceUrls: [],
          verifiedBy: options?.verifiedBy ?? null,
          metadata: doc,
          createdAt: now,
          updatedAt: now,
        })
      );
    }

    return doc;
  }

  static async findVCBySubjectOrId(identifier: string): Promise<any | null> {
    const allVcs = await this.listByType<any>('VERIFIABLE_CREDENTIAL');
    return (
      allVcs.find(
        (v) =>
          v.id === identifier ||
          v.credentialId === identifier ||
          v.credentialSubject?.id === `did:rupaykg:event:${identifier}` ||
          v.credentialSubject?.id === identifier
      ) || null
    );
  }

  static async listGuardianAnchors(limit: number = 200) {
    if (!db) return [];
    const rows = await withDbRetry(() =>
      db.select().from(hedera_anchors).orderBy(desc(hedera_anchors.createdAt)).limit(limit)
    );
    return rows.map((row: any) => ({
      id: row.id,
      recordId: row.recordId,
      credentialId: row.credentialId,
      topicId: row.topicId,
      transactionId: row.transactionId,
      consensusTimestamp: row.consensusTimestamp,
      sequenceNumber: Number((row.metadata as any)?.sequenceNumber || 0) || null,
      runningHash: (row.metadata as any)?.runningHash || row.payloadHash,
      payloadHash: row.payloadHash,
      status: row.status,
      network: row.network,
      message: row.metadata || { recordId: row.recordId, payloadHash: row.payloadHash },
      timestamp: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    }));
  }

  static async getAuditCount(category?: string): Promise<number> {
    if (!db) return 0;
    const rows = await withDbRetry(() => {
      if (category) {
        return db
          .select({ id: operational_logs.id })
          .from(operational_logs)
          .where(eq(operational_logs.category, category));
      }
      return db.select({ id: operational_logs.id }).from(operational_logs).limit(1000);
    });
    return rows.length;
  }
}
