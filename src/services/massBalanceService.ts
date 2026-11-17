import { db, withDbRetry } from '../db/index.ts';
import {
  weighbridge_records,
  waste_manifests,
  records as dbRecords,
  credit_custody,
  operational_logs,
} from '../db/schema.ts';
import { eq, and, inArray } from 'drizzle-orm';
import crypto from 'crypto';
import { OperationalStore } from './operationalStore.ts';

export interface FacilityMassBalanceSummary {
  facilityId: string;
  weighbridgeInwardKg: number;
  deliveredManifestInwardKg: number;
  processedBatchInwardKg: number;
  verifiedInwardKg: number;
  claimedOutputKg: number;
  custodyIssuedTco2e: number;
  remainingAvailableKg: number;
  utilizationPercent: number;
  conservationStatus: 'BALANCED' | 'NO_INWARD_INTAKE' | 'VIOLATION';
  computedAt: string;
}

export class MassBalanceViolationError extends Error {
  public readonly statusCode = 422;
  public readonly code = 'MASS_BALANCE_VIOLATION';
  public readonly details: Record<string, any>;

  constructor(message: string, details: Record<string, any>) {
    super(message);
    this.name = 'MassBalanceViolationError';
    this.details = details;
  }
}

export class MassBalanceService {
  /**
   * Computes live physical mass conservation for a facility or processor node
   * directly from authoritative PostgreSQL tables.
   */
  static async getFacilityMassBalance(facilityId: string): Promise<FacilityMassBalanceSummary> {
    const cleanId = String(facilityId || '').trim();
    if (!cleanId) {
      throw new Error('facilityId is required to compute mass balance.');
    }

    let weighbridgeInwardKg = 0;
    let deliveredManifestInwardKg = 0;
    let processedBatchInwardKg = 0;
    let custodyIssuedTco2e = 0;

    if (db) {
      // 1. Authoritative weighbridge tickets at this facility
      const wbRows = await withDbRetry(() =>
        db
          .select({ netWeight: weighbridge_records.netWeight })
          .from(weighbridge_records)
          .where(eq(weighbridge_records.facilityId, cleanId))
      );
      weighbridgeInwardKg = wbRows.reduce((sum, r) => sum + (Number(r.netWeight) || 0), 0);

      // Also include operator weighbridge tickets logged via SWM weighbridge endpoint referencing facilityId in metadata
      const wbLogs = await withDbRetry(() =>
        db
          .select({ metadata: operational_logs.metadata })
          .from(operational_logs)
          .where(eq(operational_logs.category, 'SWM_WEIGHBRIDGE_TICKET'))
      );
      const wbLogTicketsWithoutRow = wbLogs.filter((l: any) => {
        const m = l.metadata || {};
        return !m.weighbridgeRecordId && (m.facilityId === cleanId || m.facilityName === cleanId);
      });
      const unlinkedWbKg = wbLogTicketsWithoutRow.reduce(
        (sum: number, l: any) => sum + (Number(l.metadata?.netWeightKg) || 0),
        0
      );
      weighbridgeInwardKg += unlinkedWbKg;

      // 2. Delivered manifests destined to this facility (only count ones without weighbridge link to prevent double counting)
      const manifestRows = await withDbRetry(() =>
        db
          .select({
            weightKg: waste_manifests.weightKg,
            weighbridgeRecordId: waste_manifests.weighbridgeRecordId,
          })
          .from(waste_manifests)
          .where(
            and(
              eq(waste_manifests.destinationFacilityId, cleanId),
              inArray(waste_manifests.status, ['DELIVERED', 'PROCESSED'])
            )
          )
      );
      deliveredManifestInwardKg = manifestRows
        .filter((m) => !m.weighbridgeRecordId)
        .reduce((sum, m) => sum + (Number(m.weightKg) || 0), 0);

      // 3. Processed collection batches assigned to this processor/facility
      const allRecords = await withDbRetry(() => db.select().from(dbRecords));
      processedBatchInwardKg = allRecords
        .filter((r: any) => {
          const meta =
            typeof r.evidenceUrls === 'object' && r.evidenceUrls !== null && !Array.isArray(r.evidenceUrls)
              ? (r.evidenceUrls as any)
              : {};
          return (
            r.status === 'processed' &&
            (meta.processor_id === cleanId || meta.facility_id === cleanId)
          );
        })
        .reduce((sum, r) => sum + (Number(r.weightKg) || 0), 0);

      // 4. Credit custody issued from this facility
      const custodyRows = await withDbRetry(() =>
        db
          .select({ issuedQuantity: credit_custody.issuedQuantity })
          .from(credit_custody)
          .where(eq(credit_custody.originFacilityId, cleanId))
      );
      custodyIssuedTco2e = custodyRows.reduce((sum, c) => sum + (Number(c.issuedQuantity) || 0), 0);
    }

    const verifiedInwardKg = Number(
      (weighbridgeInwardKg + deliveredManifestInwardKg + processedBatchInwardKg).toFixed(2)
    );

    const outputClaims = await OperationalStore.listByType<any>('FACILITY_OUTPUT_CLAIM', cleanId);
    const claimedOutputKg = Number(
      outputClaims
        .filter((c) => c.status !== 'REJECTED' && c.status !== 'CANCELLED')
        .reduce((sum, c) => sum + (Number(c.quantity_kg ?? c.quantityKg ?? 0) || 0), 0)
        .toFixed(2)
    );

    const remainingAvailableKg = Number(Math.max(0, verifiedInwardKg - claimedOutputKg).toFixed(2));
    const utilizationPercent =
      verifiedInwardKg > 0 ? Number(((claimedOutputKg / verifiedInwardKg) * 100).toFixed(1)) : 0;

    let conservationStatus: FacilityMassBalanceSummary['conservationStatus'] = 'BALANCED';
    if (claimedOutputKg > verifiedInwardKg) {
      conservationStatus = 'VIOLATION';
    } else if (verifiedInwardKg === 0) {
      conservationStatus = 'NO_INWARD_INTAKE';
    }

    return {
      facilityId: cleanId,
      weighbridgeInwardKg: Number(weighbridgeInwardKg.toFixed(2)),
      deliveredManifestInwardKg: Number(deliveredManifestInwardKg.toFixed(2)),
      processedBatchInwardKg: Number(processedBatchInwardKg.toFixed(2)),
      verifiedInwardKg,
      claimedOutputKg,
      custodyIssuedTco2e: Number(custodyIssuedTco2e.toFixed(4)),
      remainingAvailableKg,
      utilizationPercent,
      conservationStatus,
      computedAt: new Date().toISOString(),
    };
  }

  /**
   * Enforces the physical law of mass conservation: outward claimed outputs
   * cannot exceed verified inward tonnage at a facility/processor node.
   */
  static async assertAndRecordOutwardClaim(params: {
    facilityId: string;
    requestedOutwardKg: number;
    outputType: string;
    claimCategory: 'PROCESSING_OUTPUT' | 'EPR_CLAIM' | 'CARBON_FEEDSTOCK_CLAIM';
    actorId: string;
    referenceId?: string;
    metadata?: Record<string, any>;
  }) {
    const qty = Number(params.requestedOutwardKg);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new Error('requestedOutwardKg must be a positive number.');
    }

    const summary = await this.getFacilityMassBalance(params.facilityId);
    const projectedOutward = Number((summary.claimedOutputKg + qty).toFixed(2));

    if (projectedOutward > summary.verifiedInwardKg) {
      const deficitKg = Number((projectedOutward - summary.verifiedInwardKg).toFixed(2));
      if (db) {
        await withDbRetry(() =>
          db.insert(operational_logs).values({
            id: `mb_anom_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
            level: 'WARN',
            category: 'MASS_BALANCE_ANOMALY',
            message: `Blocked outward ${params.claimCategory} claim of ${qty} kg for facility ${params.facilityId}: exceeds verified inward tonnage (${summary.verifiedInwardKg} kg) by ${deficitKg} kg.`,
            userId: params.actorId || null,
            metadata: {
              facilityId: params.facilityId,
              outputType: params.outputType,
              requestedOutwardKg: qty,
              existingClaimedKg: summary.claimedOutputKg,
              verifiedInwardKg: summary.verifiedInwardKg,
              deficitKg,
              referenceId: params.referenceId || null,
            },
          })
        );
      }

      throw new MassBalanceViolationError(
        `Mass balance conservation violation: Requested ${qty} kg (${params.outputType}) pushes total outward claims to ${projectedOutward} kg, exceeding verified inward tonnage (${summary.verifiedInwardKg} kg) by ${deficitKg} kg.`,
        {
          facilityId: params.facilityId,
          verifiedInwardKg: summary.verifiedInwardKg,
          existingClaimedKg: summary.claimedOutputKg,
          requestedOutwardKg: qty,
          remainingAvailableKg: summary.remainingAvailableKg,
          deficitKg,
        }
      );
    }

    const claimId = `MBC-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const claimRecord = await OperationalStore.upsert(
      'FACILITY_OUTPUT_CLAIM',
      claimId,
      {
        facilityId: params.facilityId,
        outputType: params.outputType,
        claimCategory: params.claimCategory,
        quantity_kg: qty,
        actorId: params.actorId,
        referenceId: params.referenceId || null,
        metadata: params.metadata || {},
        createdAt: new Date().toISOString(),
        status: 'VERIFIED_WITHIN_MASS_BALANCE',
      },
      {
        entityId: params.facilityId,
        status: 'VERIFIED_WITHIN_MASS_BALANCE',
        targetQuantity: summary.verifiedInwardKg,
        achievedQuantity: qty,
        verifiedBy: params.actorId,
      }
    );

    const updatedSummary = await this.getFacilityMassBalance(params.facilityId);
    return { claim: claimRecord, massBalance: updatedSummary };
  }
}
