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
import {
  advanceGcpCommercialState,
  type GcpCommercialState,
} from './gcpCommercialLifecycle.ts';

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
 * Every irreversible state transition is backed by the corresponding
 * custody or authoritative registry service. This layer never fabricates
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
      creditType: 'GREEN_CREDIT', registry: 'GCP_ICFRE',
      registryAccountId: holding.registryAccountId,
      authoritativeCreditReference: holding.creditReference,
      holderEntityId: holding.holderEntityId, quantity: holding.quantity,
      tradabilityStatus: holding.tradabilityStatus,
      authoritativeVerifiedAt: holding.verifiedAt || input.authoritativeVerifiedAt,
      actorUid: input.actorUid, idempotencyKey: input.idempotencyKey,
    });
    return { state: 'CUSTODY_ACTIVE' as const, custody };
  }

  listTradableInventory() { return listAvailablePositions('GREEN_CREDIT'); }

  async reserve(input: {
    positionId: string; quantity: number; actorUid: string; idempotencyKey: string;
    principalUid: string; role: string;
  }) {
    const result = await reservePosition(input.positionId, input.quantity, input.actorUid, input.idempotencyKey, input.principalUid, input.role);
    return { state: 'RESERVED' as const, reservation: result };
  }

  async transfer(input: {
    positionId: string; quantity: number; actorUid: string; idempotencyKey: string; buyerEntityId: string;
  }): Promise<{ state: 'TRANSFER_CONFIRMED'; confirmation: AuthoritativeTransferConfirmation }> {
    const eligible = await this.registry.verifyBuyerEligibility(input.buyerEntityId, 'GREEN_CREDIT');
    if (!eligible) throw new Error('GCP_BUYER_NOT_ELIGIBLE');

    const position: any = await getCustodyPosition(input.positionId);
    if (position.credit_type !== 'GREEN_CREDIT' || position.authoritative_registry !== 'GCP_ICFRE') throw new Error('GCP_POSITION_AUTHORITY_VIOLATION');
    if (!['RESERVED'].includes(position.status)) throw new Error('GCP_TRANSFER_REQUIRES_RESERVED_POSITION');
    if (input.quantity > Number(position.reserved_quantity)) throw new Error('GCP_TRANSFER_EXCEEDS_RESERVATION');

    const confirmation = await this.registry.transfer({
      creditReference: position.authoritative_credit_reference,
      quantity: input.quantity,
      buyerEntityId: input.buyerEntityId,
    });
    this.assertTransferConfirmation(confirmation, input);

    const custodyTransfer = await confirmAuthoritativeTransfer({
      positionId: input.positionId, quantity: input.quantity, actorUid: input.actorUid,
      idempotencyKey: input.idempotencyKey, buyerEntityId: input.buyerEntityId,
      authoritativeTransactionReference: confirmation.authoritativeTransactionReference,
      buyerEligibilityVerified: confirmation.buyerEligibilityVerified,
    });
    return { state: 'TRANSFER_CONFIRMED', confirmation: { ...confirmation, custodyTransfer } as AuthoritativeTransferConfirmation };
  }

  async reconcile(input: { creditReference: string; buyerEntityId: string; expectedQuantity: number }) {
    const holding = await this.registry.reconcile(input.creditReference, input.buyerEntityId);
    if (holding.registry !== 'GCP_ICFRE' || holding.creditType !== 'GREEN_CREDIT') throw new Error('GCP_RECONCILIATION_AUTHORITY_VIOLATION');
    if (holding.quantity < input.expectedQuantity) throw new Error('GCP_RECONCILIATION_QUANTITY_SHORTFALL');
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

  async retire(input: {
    positionId: string; quantity: number; actorUid: string; idempotencyKey: string; reason: string;
  }) {
    const position: any = await getCustodyPosition(input.positionId);
    if (position.credit_type !== 'GREEN_CREDIT' || position.authoritative_registry !== 'GCP_ICFRE') throw new Error('GCP_POSITION_AUTHORITY_VIOLATION');
    if (position.status === 'TRANSFER_PENDING' || position.status === 'RESERVED') throw new Error('GCP_RETIREMENT_REQUIRES_UNENCUMBERED_CUSTODY');

    const confirmation: AuthoritativeRetirementConfirmation = await this.registry.retire({
      creditReference: position.authoritative_credit_reference,
      quantity: input.quantity,
      holderEntityId: position.holder_entity_id,
      reason: input.reason,
    });
    if (confirmation.registry !== 'GCP_ICFRE' || confirmation.creditType !== 'GREEN_CREDIT') throw new Error('GCP_RETIREMENT_AUTHORITY_VIOLATION');
    if (!confirmation.authoritativeRetirementReference) throw new Error('GCP_RETIREMENT_REFERENCE_REQUIRED');

    const custodyRetirement = await retireCredits(
      input.positionId, input.quantity, input.actorUid, input.idempotencyKey,
      input.reason, confirmation.authoritativeRetirementReference,
    );
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
