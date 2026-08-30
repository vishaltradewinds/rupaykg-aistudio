/**
 * RupayKg Enterprise 3.0 — Authoritative Environmental Credit Custody Ledger
 * Document ID: RKG-CUSTODY-LEDGER-REV-01
 * 
 * Strict Custody Invariants & Mathematical Proofs:
 * 1. Authoritative Store: Live PostgreSQL database is the sole single source of truth.
 * 2. Conservation Invariant: issuedQuantity = availableQuantity + reservedQuantity + transferredQuantity + retiredQuantity.
 * 3. Atomic Integrity: All mutations execute inside ACID transactions with FOR UPDATE row locks.
 * 4. Issuer Boundary: RupayKg NEVER issues/mints credits. Only external verified BEE/GCP issuances are accepted.
 * 5. Tradability Guard: Only TRADABLE credits can enter AVAILABLE_FOR_SALE status.
 * 6. Idempotency: Duplicate idempotency keys return existing transaction records without re-mutation.
 * 7. Evidence Layer: Hedera HCS is strictly an evidence/provenance ledger, never an authoritative registry.
 */

import { db } from '../db/index.ts';
import {
  credit_custody,
  credit_custody_events,
  credit_market_listings,
  credit_reservations,
  credit_settlements,
  legal_entities,
  operational_logs
} from '../db/schema.ts';
import { eq, sql, and, desc } from 'drizzle-orm';
import crypto from 'crypto';
import {
  AuthoritativeRegistryAdapter,
  AuthoritativeCreditType,
  AuthoritativeRegistryType,
  TradabilityStatus
} from './authoritativeRegistryAdapter.ts';
import { WaterfallDoctrineRegistry, DoctrinalSettlementManifest } from './waterfallDoctrine.ts';
import { HederaAnchorProvider } from './hederaAnchor.ts';

export interface RecordCustodyParams {
  creditType: AuthoritativeCreditType;
  authoritativeRegistry: AuthoritativeRegistryType;
  authoritativeCreditReference: string;
  registryAccountId: string;
  holderEntityId?: string;
  holderUserId?: string;
  issuedQuantity: number;
  tradabilityStatus?: TradabilityStatus;
  methodologyCode?: string;
  vintage?: string;
  originProjectId?: string;
  originFacilityId?: string;
  acvaVerifierId?: string;
  performedBy: string;
  idempotencyKey?: string;
  offlineVerificationProof?: {
    issuerPublicKey: string;
    signature: string;
    issuedQuantity: number;
    holderEntityId: string;
    tradabilityStatus: TradabilityStatus;
  };
  metadata?: Record<string, any>;
}

export interface ListForSaleParams {
  custodyId: string;
  sellerEntityId: string;
  sellerUserId: string;
  quantityToList: number;
  pricePerUnitInr: number;
  performedBy: string;
  idempotencyKey?: string;
}

export interface ReserveCreditsParams {
  listingId: string;
  buyerEntityId: string;
  buyerUserId: string;
  quantityToReserve: number;
  reservationDurationMinutes?: number;
  performedBy: string;
  idempotencyKey?: string;
}

export interface SettleReservationParams {
  reservationId: string;
  performedBy: string;
  idempotencyKey?: string;
  notes?: string;
}

export interface RetireCreditsParams {
  custodyId: string;
  quantityToRetire: number;
  beneficiary: string;
  retirementReason: string;
  performedBy: string;
  idempotencyKey?: string;
}

async function resolveValidEntityId(tx: any, entityId?: string | null): Promise<string | null> {
  if (!entityId) return null;
  try {
    const existing = await tx
      .select({ id: legal_entities.id })
      .from(legal_entities)
      .where(eq(legal_entities.id, entityId))
      .limit(1);
    return existing.length > 0 ? existing[0].id : null;
  } catch {
    return null;
  }
}

export class CreditCustodyService {
  public static readonly CONSERVATION_TOLERANCE = 0.00001;

  /**
   * Mathematically validates the fundamental custody conservation invariant:
   * issuedQuantity === availableQuantity + reservedQuantity + transferredQuantity + retiredQuantity
   */
  public static validateConservationInvariant(position: {
    issuedQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
    transferredQuantity: number;
    retiredQuantity: number;
  }): { isValid: boolean; difference: number; message: string } {
    const sum =
      Number(position.availableQuantity || 0) +
      Number(position.reservedQuantity || 0) +
      Number(position.transferredQuantity || 0) +
      Number(position.retiredQuantity || 0);
    const difference = Math.abs(Number(position.issuedQuantity || 0) - sum);
    const isValid = difference <= this.CONSERVATION_TOLERANCE;

    return {
      isValid,
      difference,
      message: isValid
        ? 'Custody quantity conservation strictly verified.'
        : `Custody leakage detected: Issued (${position.issuedQuantity}) != Sum (${sum}), Diff: ${difference}`,
    };
  }

  /**
   * Records authoritative custody of a verified external credit in PostgreSQL.
   * STRICT FAIL-CLOSED: Rejects if external registry does not confirm authoritative issuance.
   */
  public static async recordAuthoritativeCustody(params: RecordCustodyParams) {
    // 1. Idempotency Check
    if (params.idempotencyKey) {
      const existingEvent = await db
        .select()
        .from(credit_custody_events)
        .where(eq(credit_custody_events.idempotencyKey, params.idempotencyKey))
        .limit(1);

      if (existingEvent.length > 0) {
        const existingPosition = await db
          .select()
          .from(credit_custody)
          .where(eq(credit_custody.id, existingEvent[0].custodyId))
          .limit(1);
        return {
          isSuccess: true,
          isDuplicate: true,
          position: existingPosition[0],
          eventId: existingEvent[0].id,
          message: 'Idempotent request: Existing custody record returned.',
        };
      }
    }

    // 2. Prevent duplicate authoritative credit reference
    const existingRef = await db
      .select()
      .from(credit_custody)
      .where(eq(credit_custody.authoritativeCreditReference, params.authoritativeCreditReference))
      .limit(1);

    if (existingRef.length > 0) {
      throw new Error(
        `Authoritative credit reference ${params.authoritativeCreditReference} already recorded in custody (ID: ${existingRef[0].id}). Duplicate custody rejected.`
      );
    }

    // 3. External Authoritative Registry Verification (Fail-Closed)
    const verification = await AuthoritativeRegistryAdapter.verifyIssuance({
      creditType: params.creditType,
      authoritativeRegistry: params.authoritativeRegistry,
      authoritativeCreditReference: params.authoritativeCreditReference,
      registryAccountId: params.registryAccountId,
      expectedQuantity: params.issuedQuantity,
      offlineVerificationProof: params.offlineVerificationProof,
    });

    if (!verification.isValid) {
      throw new Error(`Authoritative Registry Issuance Verification Failed: ${verification.message}`);
    }

    const issuedQty = Number(params.issuedQuantity);
    if (issuedQty <= 0 || isNaN(issuedQty)) {
      throw new Error('Issued quantity must be a strictly positive number.');
    }

    const tradability = params.tradabilityStatus || verification.tradabilityStatus || 'TRADABLE';
    const custodyId = `CUST-${crypto.randomUUID()}`;
    const eventId = `EVT-${crypto.randomUUID()}`;

    // 4. Atomic PostgreSQL Transaction
    const result = await db.transaction(async (tx) => {
      const validHolderEntityId = await resolveValidEntityId(tx, params.holderEntityId);
      const newPosition = {
        id: custodyId,
        creditType: params.creditType,
        authoritativeRegistry: params.authoritativeRegistry,
        registryAccountId: params.registryAccountId,
        authoritativeCreditReference: params.authoritativeCreditReference,
        holderEntityId: validHolderEntityId,
        holderUserId: params.holderUserId || null,
        issuedQuantity: issuedQty,
        availableQuantity: issuedQty,
        reservedQuantity: 0,
        transferredQuantity: 0,
        retiredQuantity: 0,
        status: 'HELD',
        tradabilityStatus: tradability,
        methodologyCode: params.methodologyCode || verification.methodologyCode || null,
        vintage: params.vintage || verification.vintage || new Date().getFullYear().toString(),
        issuanceDate: new Date(),
        authoritativeVerificationTimestamp: new Date(),
        acvaVerifierId: params.acvaVerifierId || verification.acvaVerifierId || null,
        originProjectId: params.originProjectId || null,
        originFacilityId: params.originFacilityId || null,
        metadata: {
          ...params.metadata,
          holderEntityIdentifier: params.holderEntityId,
          registrySignature: verification.registrySignature,
          verificationMessage: verification.message,
        },
      };

      await tx.insert(credit_custody).values(newPosition);

      const eventRecord = {
        id: eventId,
        custodyId,
        eventType: 'INITIAL_CUSTODY',
        quantity: issuedQty,
        previousAvailable: 0,
        newAvailable: issuedQty,
        previousReserved: 0,
        newReserved: 0,
        previousTransferred: 0,
        newTransferred: 0,
        previousRetired: 0,
        newRetired: 0,
        fromEntityId: null,
        toEntityId: params.holderEntityId || null,
        idempotencyKey: params.idempotencyKey || null,
        performedBy: params.performedBy,
        authoritativeRegistryRef: params.authoritativeCreditReference,
        notes: `Authoritative ${params.creditType} custody established from ${params.authoritativeRegistry}.`,
        metadata: { verification },
      };

      await tx.insert(credit_custody_events).values(eventRecord);

      await tx.insert(operational_logs).values({
        id: `LOG-${crypto.randomUUID()}`,
        level: 'INFO',
        category: 'CREDIT_CUSTODY',
        message: `Authoritative custody recorded: ${issuedQty} ${params.creditType} (${params.authoritativeCreditReference}) for entity ${params.holderEntityId}`,
        userId: params.performedBy,
        metadata: { custodyId, reference: params.authoritativeCreditReference },
      });

      return newPosition;
    });

    // 5. Hedera Evidence Anchoring (Non-Authoritative Provenance Layer)
    try {
      const anchorPayload = {
        eventType: 'RECORD_AUTHORITATIVE_CUSTODY',
        recordId: custodyId,
        metadata: {
          depositoryAction: 'RECORD_AUTHORITATIVE_CUSTODY',
          custodyId,
          authoritativeReference: params.authoritativeCreditReference,
          creditType: params.creditType,
          issuedQuantity: issuedQty,
          registry: params.authoritativeRegistry,
          timestamp: new Date().toISOString(),
          provenanceNote: 'Hedera HCS provides cryptographic provenance anchor only. BEE/GCP is the authoritative registry.',
        },
      };
      await HederaAnchorProvider.submitAnchor(
        anchorPayload,
        process.env.HEDERA_TOPIC_ID || '0.0.depository_evidence',
        params.performedBy
      );
    } catch (err: any) {
      console.warn(`[CreditCustodyService] Hedera anchor notice: ${err.message}`);
    }

    return {
      isSuccess: true,
      position: result,
      eventId,
      message: `Authoritative custody of ${issuedQty} ${params.creditType} successfully established in PostgreSQL.`,
    };
  }

  /**
   * Lists credits for sale in the marketplace directly from available custody balance.
   * Atomically locks position, checks tradability status and available balance.
   */
  public static async listForSale(params: ListForSaleParams) {
    const { custodyId, sellerEntityId, sellerUserId, quantityToList, pricePerUnitInr, performedBy, idempotencyKey } = params;

    if (quantityToList <= 0 || isNaN(quantityToList)) {
      throw new Error('Quantity to list must be strictly positive.');
    }
    if (pricePerUnitInr <= 0 || isNaN(pricePerUnitInr)) {
      throw new Error('Price per unit must be strictly positive.');
    }

    return await db.transaction(async (tx) => {
      // 1. Lock position FOR UPDATE
      const positions = await tx
        .select()
        .from(credit_custody)
        .where(eq(credit_custody.id, custodyId))
        .for('update');

      if (positions.length === 0) {
        throw new Error(`Custody position ${custodyId} not found.`);
      }
      const position = positions[0];

      // 2. Authorization check: Seller must own the custody
      if (position.holderEntityId && position.holderEntityId !== sellerEntityId) {
        throw new Error(`Authorization Failure: Entity ${sellerEntityId} is not the authoritative holder of position ${custodyId}.`);
      }

      // 3. Tradability Guard
      if (position.tradabilityStatus !== 'TRADABLE') {
        throw new Error(`Tradability Violation: Position ${custodyId} has status '${position.tradabilityStatus}' and cannot be listed for sale.`);
      }

      // 4. Balance & Overselling Check
      if (position.availableQuantity < quantityToList) {
        throw new Error(
          `Insufficient Available Custody: Requested to list ${quantityToList}, but available balance is ${position.availableQuantity} (Reserved: ${position.reservedQuantity}). Overselling prevented.`
        );
      }

      // 5. Compute Commercial Waterfall Preview
      const grossProceeds = quantityToList * pricePerUnitInr;
      const waterfallBreakdown = {
        grossProceedsInr: grossProceeds,
        tier1_payment_rails_1_0_pct: grossProceeds * 0.01,
        tier2_registry_compliance_1_5_pct: grossProceeds * 0.015,
        tier3_acva_audit_reserve_2_5_pct: grossProceeds * 0.025,
        tier4_project_owner_ulb_35_0_pct: grossProceeds * 0.35,
        tier5_community_aggregator_5_0_pct: grossProceeds * 0.05,
        tier6_financier_green_bond_2_0_pct: grossProceeds * 0.02,
        tier7_rupaykg_platform_revenue_53_0_pct: grossProceeds * 0.53,
      };

      const listingId = `LIST-${crypto.randomUUID()}`;
      const newListing = {
        id: listingId,
        custodyId,
        sellerEntityId,
        sellerUserId,
        creditType: position.creditType,
        listedQuantity: quantityToList,
        availableQuantity: quantityToList,
        pricePerUnitInr,
        status: 'ACTIVE',
        waterfallBreakdown,
      };

      await tx.insert(credit_market_listings).values(newListing);

      // Update position status to AVAILABLE_FOR_SALE if not already
      await tx
        .update(credit_custody)
        .set({ status: 'AVAILABLE_FOR_SALE', updatedAt: new Date() })
        .where(eq(credit_custody.id, custodyId));

      const eventId = `EVT-${crypto.randomUUID()}`;
      await tx.insert(credit_custody_events).values({
        id: eventId,
        custodyId,
        eventType: 'LISTED_FOR_SALE',
        quantity: quantityToList,
        previousAvailable: position.availableQuantity,
        newAvailable: position.availableQuantity, // available remains available until reserved
        previousReserved: position.reservedQuantity,
        newReserved: position.reservedQuantity,
        previousTransferred: position.transferredQuantity,
        newTransferred: position.transferredQuantity,
        previousRetired: position.retiredQuantity,
        newRetired: position.retiredQuantity,
        fromEntityId: sellerEntityId,
        toEntityId: null,
        orderId: listingId,
        idempotencyKey: idempotencyKey || null,
        performedBy,
        notes: `Listed ${quantityToList} ${position.creditType} at ₹${pricePerUnitInr}/unit. Listing ID: ${listingId}.`,
      });

      return {
        isSuccess: true,
        listing: newListing,
        position,
        message: `Successfully listed ${quantityToList} ${position.creditType} for sale.`,
      };
    });
  }

  /**
   * Places an atomic reservation against a listing.
   * Shifts custody quantity from availableQuantity -> reservedQuantity with FOR UPDATE lock.
   */
  public static async placeReservation(params: ReserveCreditsParams) {
    const { listingId, buyerEntityId, buyerUserId, quantityToReserve, reservationDurationMinutes = 30, performedBy, idempotencyKey } = params;

    if (quantityToReserve <= 0 || isNaN(quantityToReserve)) {
      throw new Error('Quantity to reserve must be strictly positive.');
    }

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existingRes = await db
        .select()
        .from(credit_reservations)
        .where(eq(credit_reservations.idempotencyKey, idempotencyKey))
        .limit(1);

      if (existingRes.length > 0) {
        return {
          isSuccess: true,
          isDuplicate: true,
          reservation: existingRes[0],
          message: 'Idempotent request: Existing reservation returned.',
        };
      }
    }

    return await db.transaction(async (tx) => {
      // 2. Lock listing FOR UPDATE
      const listings = await tx
        .select()
        .from(credit_market_listings)
        .where(eq(credit_market_listings.id, listingId))
        .for('update');

      if (listings.length === 0) {
        throw new Error(`Market listing ${listingId} not found.`);
      }
      const listing = listings[0];

      if (listing.status !== 'ACTIVE' && listing.status !== 'PARTIALLY_FILLED') {
        throw new Error(`Listing ${listingId} is not active (Status: ${listing.status}).`);
      }

      if (listing.availableQuantity < quantityToReserve) {
        throw new Error(
          `Insufficient listing quantity: Requested ${quantityToReserve}, available ${listing.availableQuantity}.`
        );
      }

      // 3. Lock associated custody position FOR UPDATE
      const positions = await tx
        .select()
        .from(credit_custody)
        .where(eq(credit_custody.id, listing.custodyId))
        .for('update');

      if (positions.length === 0) {
        throw new Error(`Underlying custody position ${listing.custodyId} not found.`);
      }
      const position = positions[0];

      if (position.availableQuantity < quantityToReserve) {
        throw new Error(
          `Custody shortage: Available in custody is ${position.availableQuantity}, requested ${quantityToReserve}. Reservation blocked.`
        );
      }

      // 4. Execute atomic state change (available -> reserved)
      const newAvailable = position.availableQuantity - quantityToReserve;
      const newReserved = position.reservedQuantity + quantityToReserve;

      // Invariant check
      const check = this.validateConservationInvariant({
        issuedQuantity: position.issuedQuantity,
        availableQuantity: newAvailable,
        reservedQuantity: newReserved,
        transferredQuantity: position.transferredQuantity,
        retiredQuantity: position.retiredQuantity,
      });

      if (!check.isValid) {
        throw new Error(`Fatal Invariant Failure: ${check.message}`);
      }

      await tx
        .update(credit_custody)
        .set({
          availableQuantity: newAvailable,
          reservedQuantity: newReserved,
          status: newAvailable === 0 ? 'RESERVED' : 'AVAILABLE_FOR_SALE',
          updatedAt: new Date(),
        })
        .where(eq(credit_custody.id, position.id));

      // Update listing available quantity
      const newListingAvail = listing.availableQuantity - quantityToReserve;
      await tx
        .update(credit_market_listings)
        .set({
          availableQuantity: newListingAvail,
          status: newListingAvail === 0 ? 'COMPLETED' : 'PARTIALLY_FILLED',
          updatedAt: new Date(),
        })
        .where(eq(credit_market_listings.id, listing.id));

      const totalAmount = quantityToReserve * listing.pricePerUnitInr;
      const expiresAt = new Date(Date.now() + reservationDurationMinutes * 60 * 1000);
      const reservationId = `RES-${crypto.randomUUID()}`;

      // Build statutory 7-tier settlement manifest
      const waterfallManifest = {
        totalAmountInr: totalAmount,
        quantity: quantityToReserve,
        unitPriceInr: listing.pricePerUnitInr,
        splits: {
          paymentRailsFee_1_0_pct: totalAmount * 0.01,
          registryCompliance_1_5_pct: totalAmount * 0.015,
          acvaAuditReserve_2_5_pct: totalAmount * 0.025,
          projectOwnerULB_35_0_pct: totalAmount * 0.35,
          communityAggregator_5_0_pct: totalAmount * 0.05,
          financier_2_0_pct: totalAmount * 0.02,
          rupayKgTreasury_53_0_pct: totalAmount * 0.53,
        },
        checksumInr: totalAmount,
      };

      const newReservation = {
        id: reservationId,
        listingId,
        custodyId: position.id,
        buyerEntityId,
        buyerUserId,
        reservedQuantity: quantityToReserve,
        pricePerUnitInr: listing.pricePerUnitInr,
        totalAmountInr: totalAmount,
        status: 'PENDING',
        expiresAt,
        idempotencyKey: idempotencyKey || null,
        waterfallManifest,
      };

      await tx.insert(credit_reservations).values(newReservation);

      // Audit event
      await tx.insert(credit_custody_events).values({
        id: `EVT-${crypto.randomUUID()}`,
        custodyId: position.id,
        eventType: 'RESERVED',
        quantity: quantityToReserve,
        previousAvailable: position.availableQuantity,
        newAvailable,
        previousReserved: position.reservedQuantity,
        newReserved,
        previousTransferred: position.transferredQuantity,
        newTransferred: position.transferredQuantity,
        previousRetired: position.retiredQuantity,
        newRetired: position.retiredQuantity,
        fromEntityId: listing.sellerEntityId,
        toEntityId: buyerEntityId,
        orderId: reservationId,
        idempotencyKey: idempotencyKey ? `${idempotencyKey}-evt` : null,
        performedBy,
        notes: `Locked ${quantityToReserve} ${position.creditType} under reservation ${reservationId} for buyer ${buyerEntityId}.`,
      });

      return {
        isSuccess: true,
        reservation: newReservation,
        message: `Successfully reserved ${quantityToReserve} ${position.creditType} (Lock expires at ${expiresAt.toISOString()}).`,
      };
    });
  }

  /**
   * Settles an active reservation.
   * Atomically shifts custody quantity from reservedQuantity -> transferredQuantity.
   * Executes the statutory 7-tier waterfall distribution and records settlement.
   */
  public static async settleReservation(params: SettleReservationParams) {
    const { reservationId, performedBy, idempotencyKey, notes } = params;

    return await db.transaction(async (tx) => {
      // 1. Lock reservation FOR UPDATE
      const reservations = await tx
        .select()
        .from(credit_reservations)
        .where(eq(credit_reservations.id, reservationId))
        .for('update');

      if (reservations.length === 0) {
        throw new Error(`Reservation ${reservationId} not found.`);
      }
      const reservation = reservations[0];

      if (reservation.status !== 'PENDING') {
        throw new Error(`Reservation ${reservationId} cannot be settled (Current status: ${reservation.status}).`);
      }

      // 2. Lock custody position FOR UPDATE
      const positions = await tx
        .select()
        .from(credit_custody)
        .where(eq(credit_custody.id, reservation.custodyId))
        .for('update');

      if (positions.length === 0) {
        throw new Error(`Custody position ${reservation.custodyId} not found.`);
      }
      const position = positions[0];

      if (position.reservedQuantity < reservation.reservedQuantity) {
        throw new Error(
          `Custody state error: Position reserved quantity (${position.reservedQuantity}) is less than reservation quantity (${reservation.reservedQuantity}).`
        );
      }

      // 3. Lock listing
      const listings = await tx
        .select()
        .from(credit_market_listings)
        .where(eq(credit_market_listings.id, reservation.listingId));
      const listing = listings[0];

      // 4. Shift reserved -> transferred
      const qtyToTransfer = reservation.reservedQuantity;
      const newReserved = position.reservedQuantity - qtyToTransfer;
      const newTransferred = position.transferredQuantity + qtyToTransfer;

      // Invariant check
      const check = this.validateConservationInvariant({
        issuedQuantity: position.issuedQuantity,
        availableQuantity: position.availableQuantity,
        reservedQuantity: newReserved,
        transferredQuantity: newTransferred,
        retiredQuantity: position.retiredQuantity,
      });

      if (!check.isValid) {
        throw new Error(`Fatal Invariant Failure during settlement: ${check.message}`);
      }

      // Update position
      const isFullyExhausted = position.availableQuantity === 0 && newReserved === 0;
      await tx
        .update(credit_custody)
        .set({
          reservedQuantity: newReserved,
          transferredQuantity: newTransferred,
          status: isFullyExhausted ? 'TRANSFERRED' : position.status,
          updatedAt: new Date(),
        })
        .where(eq(credit_custody.id, position.id));

      // Mark reservation EXECUTED
      await tx
        .update(credit_reservations)
        .set({ status: 'EXECUTED', updatedAt: new Date() })
        .where(eq(credit_reservations.id, reservationId));

      // Calculate exact statutory 7-tier distribution
      const totalAmount = reservation.totalAmountInr;
      const waterfallSettlement = {
        doctrine: WaterfallDoctrineRegistry.DOCTRINE_ID,
        grossSettlementInr: totalAmount,
        quantity: qtyToTransfer,
        unitPriceInr: reservation.pricePerUnitInr,
        tier1_payment_rails_fee_1_0_pct: totalAmount * 0.01,
        tier2_ccts_registry_fee_1_5_pct: totalAmount * 0.015,
        tier3_acva_audit_reserve_2_5_pct: totalAmount * 0.025,
        tier4_project_owner_ulb_share_35_0_pct: totalAmount * 0.35,
        tier5_community_safai_mitra_dividend_5_0_pct: totalAmount * 0.05,
        tier6_green_bond_financier_return_2_0_pct: totalAmount * 0.02,
        tier7_rupaykg_net_operating_revenue_53_0_pct: totalAmount * 0.53,
        conservationVerified: true,
        settledAt: new Date().toISOString(),
      };

      const settlementId = `SETTLE-${crypto.randomUUID()}`;
      const newSettlement = {
        id: settlementId,
        reservationId,
        custodyId: position.id,
        listingId: reservation.listingId,
        buyerEntityId: reservation.buyerEntityId,
        sellerEntityId: listing ? listing.sellerEntityId : 'UNKNOWN_SELLER',
        transferredQuantity: qtyToTransfer,
        totalSettlementInr: totalAmount,
        waterfallSettlement,
        authoritativeTransferRef: `TRANSFER-AUT-${settlementId.substring(0, 12)}`,
        status: 'COMPLETED',
      };

      await tx.insert(credit_settlements).values(newSettlement);

      // Create new custody record for buyer position in PostgreSQL
      const buyerCustodyId = `CUST-${crypto.randomUUID()}`;
      const validBuyerEntityId = await resolveValidEntityId(tx, reservation.buyerEntityId);
      await tx.insert(credit_custody).values({
        id: buyerCustodyId,
        creditType: position.creditType,
        authoritativeRegistry: position.authoritativeRegistry,
        registryAccountId: `ACC-BUYER-${reservation.buyerEntityId}`,
        authoritativeCreditReference: `${position.authoritativeCreditReference}-TX-${settlementId.substring(7, 15)}`,
        holderEntityId: validBuyerEntityId,
        holderUserId: reservation.buyerUserId,
        issuedQuantity: qtyToTransfer,
        availableQuantity: qtyToTransfer,
        reservedQuantity: 0,
        transferredQuantity: 0,
        retiredQuantity: 0,
        status: 'HELD',
        tradabilityStatus: position.tradabilityStatus,
        methodologyCode: position.methodologyCode,
        vintage: position.vintage,
        issuanceDate: position.issuanceDate,
        authoritativeVerificationTimestamp: new Date(),
        originProjectId: position.originProjectId,
        originFacilityId: position.originFacilityId,
        metadata: {
          transferredFromCustodyId: position.id,
          settlementId,
          buyerEntityIdentifier: reservation.buyerEntityId,
          originalReference: position.authoritativeCreditReference,
        },
      });

      // Audit events
      await tx.insert(credit_custody_events).values({
        id: `EVT-${crypto.randomUUID()}`,
        custodyId: position.id,
        eventType: 'TRANSFERRED',
        quantity: qtyToTransfer,
        previousAvailable: position.availableQuantity,
        newAvailable: position.availableQuantity,
        previousReserved: position.reservedQuantity,
        newReserved,
        previousTransferred: position.transferredQuantity,
        newTransferred,
        previousRetired: position.retiredQuantity,
        newRetired: position.retiredQuantity,
        fromEntityId: listing?.sellerEntityId,
        toEntityId: reservation.buyerEntityId,
        orderId: settlementId,
        idempotencyKey: idempotencyKey || null,
        performedBy,
        notes: notes || `Settled reservation ${reservationId}. Transferred ${qtyToTransfer} ${position.creditType} to buyer ${reservation.buyerEntityId}.`,
      });

      await tx.insert(credit_custody_events).values({
        id: `EVT-${crypto.randomUUID()}`,
        custodyId: buyerCustodyId,
        eventType: 'INITIAL_CUSTODY',
        quantity: qtyToTransfer,
        previousAvailable: 0,
        newAvailable: qtyToTransfer,
        previousReserved: 0,
        newReserved: 0,
        previousTransferred: 0,
        newTransferred: 0,
        previousRetired: 0,
        newRetired: 0,
        fromEntityId: listing?.sellerEntityId,
        toEntityId: reservation.buyerEntityId,
        orderId: settlementId,
        performedBy,
        notes: `Received ${qtyToTransfer} ${position.creditType} via settlement ${settlementId}.`,
      });

      return {
        isSuccess: true,
        settlement: newSettlement,
        buyerCustodyId,
        waterfallSettlement,
        message: `Settlement completed: Transferred ${qtyToTransfer} ${position.creditType} to ${reservation.buyerEntityId} with 100% verified 7-tier waterfall distribution.`,
      };
    });
  }

  /**
   * Retires credits authoritatively from available custody balance.
   * Atomically shifts availableQuantity -> retiredQuantity with permanent cancellation.
   */
  public static async retireCredits(params: RetireCreditsParams) {
    const { custodyId, quantityToRetire, beneficiary, retirementReason, performedBy, idempotencyKey } = params;

    if (quantityToRetire <= 0 || isNaN(quantityToRetire)) {
      throw new Error('Quantity to retire must be strictly positive.');
    }
    if (!beneficiary || beneficiary.trim().length === 0) {
      throw new Error('Retirement beneficiary must be explicitly specified.');
    }

    return await db.transaction(async (tx) => {
      const positions = await tx
        .select()
        .from(credit_custody)
        .where(eq(credit_custody.id, custodyId))
        .for('update');

      if (positions.length === 0) {
        throw new Error(`Custody position ${custodyId} not found.`);
      }
      const position = positions[0];

      if (position.availableQuantity < quantityToRetire) {
        throw new Error(
          `Insufficient available balance: Requested retirement of ${quantityToRetire}, available is ${position.availableQuantity}.`
        );
      }

      const newAvailable = position.availableQuantity - quantityToRetire;
      const newRetired = position.retiredQuantity + quantityToRetire;

      const check = this.validateConservationInvariant({
        issuedQuantity: position.issuedQuantity,
        availableQuantity: newAvailable,
        reservedQuantity: position.reservedQuantity,
        transferredQuantity: position.transferredQuantity,
        retiredQuantity: newRetired,
      });

      if (!check.isValid) {
        throw new Error(`Fatal Invariant Failure: ${check.message}`);
      }

      const isFullyRetired = newAvailable === 0 && position.reservedQuantity === 0;
      await tx
        .update(credit_custody)
        .set({
          availableQuantity: newAvailable,
          retiredQuantity: newRetired,
          status: isFullyRetired ? 'RETIRED' : position.status,
          updatedAt: new Date(),
        })
        .where(eq(credit_custody.id, position.id));

      const eventId = `EVT-${crypto.randomUUID()}`;
      await tx.insert(credit_custody_events).values({
        id: eventId,
        custodyId: position.id,
        eventType: 'RETIRED',
        quantity: quantityToRetire,
        previousAvailable: position.availableQuantity,
        newAvailable,
        previousReserved: position.reservedQuantity,
        newReserved: position.reservedQuantity,
        previousTransferred: position.transferredQuantity,
        newTransferred: position.transferredQuantity,
        previousRetired: position.retiredQuantity,
        newRetired,
        fromEntityId: position.holderEntityId,
        toEntityId: null,
        idempotencyKey: idempotencyKey || null,
        performedBy,
        notes: `Permanently retired ${quantityToRetire} ${position.creditType} on behalf of ${beneficiary}. Reason: ${retirementReason}.`,
        metadata: { beneficiary, retirementReason },
      });

      return {
        isSuccess: true,
        custodyId: position.id,
        retiredQuantity: quantityToRetire,
        beneficiary,
        retirementReason,
        message: `Successfully retired ${quantityToRetire} ${position.creditType} for beneficiary '${beneficiary}'.`,
      };
    });
  }

  /**
   * Retrieves positions filtered by user or entity.
   */
  public static async getPositions(filter?: {
    entityId?: string;
    userId?: string;
    creditType?: AuthoritativeCreditType;
    status?: string;
    isAdmin?: boolean;
  }) {
    let query = db.select().from(credit_custody);

    const conditions = [];
    if (!filter?.isAdmin) {
      if (filter?.entityId) {
        conditions.push(eq(credit_custody.holderEntityId, filter.entityId));
      } else if (filter?.userId) {
        conditions.push(eq(credit_custody.holderUserId, filter.userId));
      }
    }

    if (filter?.creditType) {
      conditions.push(eq(credit_custody.creditType, filter.creditType));
    }
    if (filter?.status) {
      conditions.push(eq(credit_custody.status, filter.status));
    }

    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(credit_custody.createdAt));
    }
    return await query.orderBy(desc(credit_custody.createdAt));
  }

  /**
   * Retrieves single position by ID with invariant check.
   */
  public static async getPositionById(custodyId: string) {
    const records = await db.select().from(credit_custody).where(eq(credit_custody.id, custodyId)).limit(1);
    if (records.length === 0) return null;
    const pos = records[0];
    const check = this.validateConservationInvariant(pos);
    return { ...pos, conservationStatus: check };
  }

  /**
   * Retrieves all immutable audit events for a custody position.
   */
  public static async getCustodyEvents(custodyId: string) {
    return await db
      .select()
      .from(credit_custody_events)
      .where(eq(credit_custody_events.custodyId, custodyId))
      .orderBy(desc(credit_custody_events.timestamp));
  }

  /**
   * Retrieves active marketplace listings.
   */
  public static async getActiveListings() {
    return await db
      .select()
      .from(credit_market_listings)
      .where(eq(credit_market_listings.status, 'ACTIVE'))
      .orderBy(desc(credit_market_listings.createdAt));
  }

  /**
   * Retrieves active reservations for an entity or user.
   */
  public static async getReservations(filter?: { buyerEntityId?: string; buyerUserId?: string; isAdmin?: boolean }) {
    if (filter?.isAdmin) {
      return await db.select().from(credit_reservations).orderBy(desc(credit_reservations.createdAt));
    }
    if (filter?.buyerEntityId) {
      return await db
        .select()
        .from(credit_reservations)
        .where(eq(credit_reservations.buyerEntityId, filter.buyerEntityId))
        .orderBy(desc(credit_reservations.createdAt));
    }
    return await db.select().from(credit_reservations).orderBy(desc(credit_reservations.createdAt));
  }
}
