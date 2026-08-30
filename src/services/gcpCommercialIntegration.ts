import {
  confirmAuthoritativeTransfer,
  createCustodyPosition,
  getCustodyPosition,
  listAvailablePositions,
  reservePosition,
  retireCredits,
} from './environmentalCreditRepository.ts';
import {
  getAuthoritativeRegistryAdapter,
  type AuthoritativeRetirementConfirmation,
  type AuthoritativeTransferConfirmation,
  type CreditRegistryAdapter,
} from './authoritativeCreditRegistry.ts';
import { advanceGcpCommercialState, type GcpCommercialState } from './gcpCommercialLifecycle.ts';
import { getGcpCommercialState, recordGcpCommercialTransition } from './gcpCommercialLifecycleLedger.ts';

export type GcpSettlementInput = {
  reservationActive: boolean;
  authoritativeTransferConfirmed: boolean;
  reconciled: boolean;
  tradeValue: number;
  currency: string;
};

export type GcpSettlementResult = {
  settled: boolean;
  amount: number;
  currency: string;
  reason?: string;
};

/**
 * GCP commercial integration boundary.
 *
 * RupayKg records custody/clearing state only after the corresponding
 * authoritative programme fact exists. Lifecycle transitions are persisted
 * as an append-only hash-chained ledger; no internal event fabricates
 * issuance, transfer, reconciliation or retirement evidence.
 */
export class GcpCommercialIntegration {
  constructor(private readonly registry: CreditRegistryAdapter = getAuthoritativeRegistryAdapter('GCP_ICFRE')) {}

  async admitCustody(input: {
    registryAccountId: string;
    authoritativeCreditReference: string;
    holderEntityId: string;
    quantity: number;
    authoritativeVerifiedAt: string;
    actorUid: string;
    idempotencyKey: string;
  }) {
    const holding = await this.registry.verifyHolding(input.authoritativeCreditReference, input.holderEntityId);
    if (holding.registry !== 'GCP_ICFRE' || holding.creditType !== 'GREEN_CREDIT') throw new Error('GCP_AUTHORITY_BOUNDARY_VIOLATION');
    if (holding.quantity !== input.quantity) throw new Error('GCP_CUSTODY_QUANTITY_MISMATCH');
    if (holding.registryAccountId !== input.registryAccountId) throw new Error('GCP_REGISTRY_ACCOUNT_MISMATCH');

    const custody = await createCustodyPosition({
      creditType: 'GREEN_CREDIT', registry: 'GCP_ICFRE', registryAccountId: holding.registryAccountId,
      authoritativeCreditReference: holding.creditReference, holderEntityId: holding.holderEntityId,
      quantity: holding.quantity, tradabilityStatus: holding.tradabilityStatus,
      authoritativeVerifiedAt: holding.verifiedAt || input.authoritativeVerifiedAt,
      actorUid: input.actorUid, idempotencyKey: input.idempotencyKey,
    });
    const positionId = String(custody.position_id || custody.positionId || custody.id);
    if (!positionId || positionId === 'undefined') throw new Error('GCP_CUSTODY_POSITION_ID_REQUIRED');
    await recordGcpCommercialTransition({
      positionId, toState: 'CUSTODY_ACTIVE', eventType: 'CUSTODY_ADMITTED', actorUid: input.actorUid,
      idempotencyKey: `gcp:lifecycle:custody:${input.idempotencyKey}`,
      authoritativeReference: holding.authoritativeSourceReference || holding.creditReference,
      quantity: holding.quantity,
      metadata: { registry: holding.registry, creditType: holding.creditType },
    });
    return { state: 'CUSTODY_ACTIVE' as const, custody, positionId };
  }

  listTradableInventory() { return listAvailablePositions('GREEN_CREDIT'); }

  async list(input: { positionId: string; actorUid: string; idempotencyKey: string }) {
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'CUSTODY_ACTIVE' && state !== 'LISTED') throw new Error('GCP_LISTING_REQUIRES_ACTIVE_CUSTODY');
    if (state !== 'LISTED') await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'LISTED', eventType: 'LISTED', actorUid: input.actorUid, idempotencyKey: `gcp:lifecycle:list:${input.idempotencyKey}` });
    return { state: 'LISTED' as const, positionId: input.positionId };
  }

  async reserve(input: { positionId: string; quantity: number; actorUid: string; idempotencyKey: string; principalUid: string; role: string }) {
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'LISTED' && state !== 'RESERVED') throw new Error('GCP_RESERVATION_REQUIRES_LISTED_POSITION');
    const result = await reservePosition(input.positionId, input.quantity, input.actorUid, input.idempotencyKey, input.principalUid, input.role);
    if (state !== 'RESERVED') await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'RESERVED', eventType: 'RESERVED', actorUid: input.actorUid, idempotencyKey: `gcp:lifecycle:reserve:${input.idempotencyKey}`, quantity: input.quantity });
    return { state: 'RESERVED' as const, reservation: result };
  }

  async transfer(input: { positionId: string; quantity: number; actorUid: string; idempotencyKey: string; buyerEntityId: string }): Promise<{ state: 'TRANSFER_CONFIRMED'; confirmation: AuthoritativeTransferConfirmation }> {
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'RESERVED' && state !== 'TRANSFER_PENDING') throw new Error('GCP_TRANSFER_REQUIRES_RESERVED_POSITION');
    const eligible = await this.registry.verifyBuyerEligibility(input.buyerEntityId, 'GREEN_CREDIT');
    if (!eligible) throw new Error('GCP_BUYER_NOT_ELIGIBLE');

    const position: any = await getCustodyPosition(input.positionId);
    if (position.credit_type !== 'GREEN_CREDIT' || position.authoritative_registry !== 'GCP_ICFRE') throw new Error('GCP_POSITION_AUTHORITY_VIOLATION');
    if (position.status !== 'RESERVED') throw new Error('GCP_TRANSFER_REQUIRES_RESERVED_POSITION');
    if (input.quantity > Number(position.reserved_quantity)) throw new Error('GCP_TRANSFER_EXCEEDS_RESERVATION');

    if (state === 'RESERVED') await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'TRANSFER_PENDING', eventType: 'TRANSFER_PENDING', actorUid: input.actorUid, idempotencyKey: `gcp:lifecycle:pending:${input.idempotencyKey}`, quantity: input.quantity });

    const confirmation = await this.registry.transfer({ creditReference: position.authoritative_credit_reference, quantity: input.quantity, buyerEntityId: input.buyerEntityId });
    this.assertTransferConfirmation(confirmation, input);

    const custodyTransfer = await confirmAuthoritativeTransfer({
      positionId: input.positionId, quantity: input.quantity, actorUid: input.actorUid,
      idempotencyKey: input.idempotencyKey, buyerEntityId: input.buyerEntityId,
      authoritativeTransactionReference: confirmation.authoritativeTransactionReference,
      buyerEligibilityVerified: confirmation.buyerEligibilityVerified,
    });
    await recordGcpCommercialTransition({
      positionId: input.positionId, toState: 'TRANSFER_CONFIRMED', eventType: 'TRANSFER_CONFIRMED', actorUid: input.actorUid,
      idempotencyKey: `gcp:lifecycle:confirmed:${input.idempotencyKey}`,
      authoritativeReference: confirmation.authoritativeTransactionReference, quantity: input.quantity,
      metadata: { buyerEntityId: input.buyerEntityId, buyerEligibilityVerified: true, custodyTransferId: custodyTransfer.id },
    });
    return { state: 'TRANSFER_CONFIRMED', confirmation: { ...confirmation, custodyTransfer } as AuthoritativeTransferConfirmation };
  }

  async reconcile(input: { positionId?: string; creditReference: string; buyerEntityId: string; expectedQuantity: number }) {
    const holding = await this.registry.reconcile(input.creditReference, input.buyerEntityId);
    if (holding.registry !== 'GCP_ICFRE' || holding.creditType !== 'GREEN_CREDIT') throw new Error('GCP_RECONCILIATION_AUTHORITY_VIOLATION');
    if (holding.quantity < input.expectedQuantity) throw new Error('GCP_RECONCILIATION_QUANTITY_SHORTFALL');
    if (!input.positionId) throw new Error('GCP_LIFECYCLE_POSITION_REQUIRED');
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'TRANSFER_CONFIRMED' && state !== 'RECONCILED') throw new Error('GCP_RECONCILIATION_REQUIRES_CONFIRMED_TRANSFER');
    if (state !== 'RECONCILED') await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'RECONCILED', eventType: 'RECONCILED', authoritativeReference: holding.authoritativeSourceReference || holding.creditReference, quantity: holding.quantity, metadata: { buyerEntityId: input.buyerEntityId } });
    return { state: 'RECONCILED' as const, holding };
  }

  settle(input: GcpSettlementInput): GcpSettlementResult {
    if (!input.reservationActive) return { settled: false, amount: 0, currency: input.currency, reason: 'SETTLEMENT_REQUIRES_ACTIVE_RESERVATION' };
    if (!input.authoritativeTransferConfirmed) return { settled: false, amount: 0, currency: input.currency, reason: 'AUTHORITATIVE_TRANSFER_NOT_CONFIRMED' };
    if (!input.reconciled) return { settled: false, amount: 0, currency: input.currency, reason: 'CUSTODY_RECONCILIATION_NOT_COMPLETE' };
    if (!Number.isFinite(input.tradeValue) || input.tradeValue <= 0) return { settled: false, amount: 0, currency: input.currency, reason: 'INVALID_TRADE_VALUE' };
    if (!input.currency.trim()) return { settled: false, amount: 0, currency: input.currency, reason: 'CURRENCY_REQUIRED' };
    return { settled: true, amount: Number(input.tradeValue.toFixed(2)), currency: input.currency };
  }

  async settleAndRecord(input: GcpSettlementInput & { positionId: string; actorUid: string; idempotencyKey: string }) {
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'RECONCILED' && state !== 'SETTLED') throw new Error('GCP_SETTLEMENT_REQUIRES_RECONCILIATION');
    const result = this.settle(input);
    if (!result.settled) return result;
    if (state !== 'SETTLED') await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'SETTLED', eventType: 'SETTLED', actorUid: input.actorUid, idempotencyKey: `gcp:lifecycle:settle:${input.idempotencyKey}`, quantity: undefined, metadata: { amount: result.amount, currency: result.currency } });
    return result;
  }

  async retire(input: { positionId: string; quantity: number; actorUid: string; idempotencyKey: string; reason: string }) {
    const state = await getGcpCommercialState(input.positionId);
    if (state !== 'SETTLED' && state !== 'RETIRED') throw new Error('GCP_RETIREMENT_REQUIRES_SETTLED_STATE');
    const position: any = await getCustodyPosition(input.positionId);
    if (position.credit_type !== 'GREEN_CREDIT' || position.authoritative_registry !== 'GCP_ICFRE') throw new Error('GCP_POSITION_AUTHORITY_VIOLATION');
    if (position.status === 'TRANSFER_PENDING' || position.status === 'RESERVED') throw new Error('GCP_RETIREMENT_REQUIRES_UNENCUMBERED_CUSTODY');
    if (state === 'RETIRED') return { state: 'RETIRED' as const };

    const confirmation: AuthoritativeRetirementConfirmation = await this.registry.retire({
      creditReference: position.authoritative_credit_reference, quantity: input.quantity,
      holderEntityId: position.holder_entity_id, reason: input.reason,
    });
    if (confirmation.registry !== 'GCP_ICFRE' || confirmation.creditType !== 'GREEN_CREDIT') throw new Error('GCP_RETIREMENT_AUTHORITY_VIOLATION');
    if (!confirmation.authoritativeRetirementReference) throw new Error('GCP_RETIREMENT_REFERENCE_REQUIRED');

    const custodyRetirement = await retireCredits(input.positionId, input.quantity, input.actorUid, input.idempotencyKey, input.reason, confirmation.authoritativeRetirementReference);
    await recordGcpCommercialTransition({ positionId: input.positionId, toState: 'RETIRED', eventType: 'RETIRED', actorUid: input.actorUid, idempotencyKey: `gcp:lifecycle:retire:${input.idempotencyKey}`, authoritativeReference: confirmation.authoritativeRetirementReference, quantity: input.quantity, metadata: { authoritativeRetirementConfirmed: true, custodyRetirementId: custodyRetirement.id } });
    return { state: 'RETIRED' as const, confirmation, custodyRetirement };
  }

  static transition(from: GcpCommercialState, to: GcpCommercialState) { return advanceGcpCommercialState(from, to); }

  private assertTransferConfirmation(confirmation: AuthoritativeTransferConfirmation, input: { quantity: number; buyerEntityId: string }) {
    if (confirmation.registry !== 'GCP_ICFRE' || confirmation.creditType !== 'GREEN_CREDIT') throw new Error('GCP_TRANSFER_AUTHORITY_VIOLATION');
    if (!confirmation.buyerEligibilityVerified) throw new Error('GCP_BUYER_ELIGIBILITY_NOT_CONFIRMED');
    if (confirmation.buyerEntityId !== input.buyerEntityId) throw new Error('GCP_TRANSFER_BUYER_MISMATCH');
    if (confirmation.quantity !== input.quantity) throw new Error('GCP_TRANSFER_QUANTITY_MISMATCH');
    if (!confirmation.authoritativeTransactionReference) throw new Error('GCP_TRANSFER_REFERENCE_REQUIRED');
  }
}
