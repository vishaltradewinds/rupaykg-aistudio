import { db } from '../db/index.ts';
import { records } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class RecordService {
  static formatRecord(r: any) {
    if (!r) return null;
    const meta = (typeof r.evidenceUrls === 'object' && r.evidenceUrls !== null && !Array.isArray(r.evidenceUrls))
      ? r.evidenceUrls
      : {};
    const urls = Array.isArray(r.evidenceUrls) ? r.evidenceUrls : (meta.urls || []);

    return {
      id: r.id,
      citizen_id: r.userId,
      user_id: r.userId,
      waste_type: r.wasteType,
      weight_kg: r.weightKg,
      weight: r.weightKg,
      village: r.village,
      district: meta.district || r.district || 'Jabalpur',
      state: meta.state || r.state || 'Madhya Pradesh',
      status: r.status,
      mrv_status: r.mrvStatus,
      mrv_verified_by: r.mrvVerifiedBy,
      total_value: r.totalValue,
      ccc_amount_kg: r.cccAmountKg,
      potential_ccc_value: r.potentialCccValue,
      risk_score: r.riskScore,
      evidence_urls: urls,
      context: meta.context || 'rural',
      aggregator_id: meta.aggregator_id || null,
      processor_id: meta.processor_id || null,
      purchased_by: meta.purchased_by || null,
      purchased_by_name: meta.purchased_by_name || null,
      purchased_at: meta.purchased_at || null,
      purchase_price: meta.purchase_price || null,
      carbon_revenue_accrued_to: meta.carbon_revenue_accrued_to || null,
      generator_payout: meta.generator_payout !== undefined ? meta.generator_payout : (r.totalValue || 0),
      base_value: meta.base_value !== undefined ? meta.base_value : (r.totalValue || 0),
      geo_lat: meta.geo_lat || null,
      geo_long: meta.geo_long || null,
      blockchain_hash: meta.blockchain_hash || null,
      hcs_transaction_id: meta.hcs_transaction_id || meta.blockchain_hash || null,
      batch_id: meta.batch_id || null,
      registry_serial_number: meta.registry_serial_number || null,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
    };

  }

  static async addRecord(record: any) {
    const id = record.id || `rec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const rawUrls = record.evidence_urls || record.evidenceUrls || [];
    const meta = {
      urls: Array.isArray(rawUrls) ? rawUrls : [],
      context: record.context || 'rural',
      aggregator_id: record.aggregator_id || record.aggregatorId || null,
      processor_id: record.processor_id || record.processorId || null,
      purchased_by: record.purchased_by || record.purchasedBy || null,
      purchased_by_name: record.purchased_by_name || null,
      purchased_at: record.purchased_at || null,
      purchase_price: record.purchase_price || null,
      carbon_revenue_accrued_to: record.carbon_revenue_accrued_to || null,
      generator_payout: record.generator_payout !== undefined ? record.generator_payout : (record.total_value || 0),
      base_value: record.base_value !== undefined ? record.base_value : (record.total_value || 0),
      geo_lat: record.geo_lat || null,
      geo_long: record.geo_long || null,
      blockchain_hash: record.blockchain_hash || null,
      batch_id: record.batch_id || null,
      registry_serial_number: record.registry_serial_number || null,
    };

    const mapped = {
      id,
      userId: record.citizen_id || record.user_id || record.userId || 'system',
      wasteType: record.waste_type || record.wasteType || 'General Waste',
      weightKg: Number(record.weight_kg || record.weightKg || 0),
      village: record.village || null,
      status: record.status || 'pending',
      mrvStatus: record.mrv_status || record.mrvStatus || 'pending',
      mrvVerifiedBy: record.mrv_verified_by || record.mrvVerifiedBy || null,
      totalValue: Number(record.total_value || record.totalValue || 0),
      cccAmountKg: Number(record.ccc_amount_kg || record.cccAmountKg || 0),
      potentialCccValue: Number(record.potential_ccc_value || record.potentialCccValue || 0),
      riskScore: Number(record.risk_score || record.riskScore || 0),
      evidenceUrls: meta,
      timestamp: new Date(record.timestamp || Date.now()),
    };

    await db.insert(records).values(mapped).onConflictDoNothing();
    return this.formatRecord(mapped);
  }

  static async getRecord(id: string) {
    const result = await db.select().from(records).where(eq(records.id, id));
    return result[0] ? this.formatRecord(result[0]) : null;
  }

  static async updateRecord(id: string, updates: any) {
    const existing = await db.select().from(records).where(eq(records.id, id));
    if (!existing || existing.length === 0) return null;
    const current = existing[0];
    const currentMeta = (typeof current.evidenceUrls === 'object' && current.evidenceUrls !== null && !Array.isArray(current.evidenceUrls))
      ? current.evidenceUrls
      : {};

    const updatePayload: any = {};
    if (updates.status !== undefined) updatePayload.status = updates.status;
    if (updates.mrv_status !== undefined) updatePayload.mrvStatus = updates.mrv_status;
    if (updates.mrvStatus !== undefined) updatePayload.mrvStatus = updates.mrvStatus;
    if (updates.mrv_verified_by !== undefined) updatePayload.mrvVerifiedBy = updates.mrv_verified_by;
    if (updates.mrvVerifiedBy !== undefined) updatePayload.mrvVerifiedBy = updates.mrvVerifiedBy;
    if (updates.total_value !== undefined) updatePayload.totalValue = Number(updates.total_value);
    if (updates.totalValue !== undefined) updatePayload.totalValue = Number(updates.totalValue);
    if (updates.ccc_amount_kg !== undefined) updatePayload.cccAmountKg = Number(updates.ccc_amount_kg);
    if (updates.cccAmountKg !== undefined) updatePayload.cccAmountKg = Number(updates.cccAmountKg);
    if (updates.risk_score !== undefined) updatePayload.riskScore = Number(updates.risk_score);
    if (updates.riskScore !== undefined) updatePayload.riskScore = Number(updates.riskScore);

    const newMeta = {
      ...currentMeta,
      ...(updates.context !== undefined && { context: updates.context }),
      ...(updates.aggregator_id !== undefined && { aggregator_id: updates.aggregator_id }),
      ...(updates.processor_id !== undefined && { processor_id: updates.processor_id }),
      ...(updates.purchased_by !== undefined && { purchased_by: updates.purchased_by }),
      ...(updates.purchased_by_name !== undefined && { purchased_by_name: updates.purchased_by_name }),
      ...(updates.purchased_at !== undefined && { purchased_at: updates.purchased_at }),
      ...(updates.purchase_price !== undefined && { purchase_price: updates.purchase_price }),
      ...(updates.carbon_revenue_accrued_to !== undefined && { carbon_revenue_accrued_to: updates.carbon_revenue_accrued_to }),
      ...(updates.generator_payout !== undefined && { generator_payout: updates.generator_payout }),
      ...(updates.base_value !== undefined && { base_value: updates.base_value }),
      ...(updates.geo_lat !== undefined && { geo_lat: updates.geo_lat }),
      ...(updates.geo_long !== undefined && { geo_long: updates.geo_long }),
      ...(updates.blockchain_hash !== undefined && { blockchain_hash: updates.blockchain_hash }),
      ...(updates.registry_serial_number !== undefined && { registry_serial_number: updates.registry_serial_number }),
      ...(updates.evidence_urls !== undefined && { urls: updates.evidence_urls }),
    };
    updatePayload.evidenceUrls = newMeta;

    await db.update(records).set(updatePayload).where(eq(records.id, id));
    return await this.getRecord(id);
  }

  static async deleteRecord(id: string) {
    await db.delete(records).where(eq(records.id, id));
    return true;
  }

  static async getAllRecords() {
    const rows = await db.select().from(records).orderBy(desc(records.timestamp));
    return rows.map(r => this.formatRecord(r));
  }

  static async getUserRecords(userId: string) {
    const rows = await db.select().from(records).where(eq(records.userId, userId)).orderBy(desc(records.timestamp));
    return rows.map(r => this.formatRecord(r));
  }
}
