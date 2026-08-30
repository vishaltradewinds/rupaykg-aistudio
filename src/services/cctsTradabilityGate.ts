export type CccTradabilityInput = {
  custodyStatus: 'CUSTODY_ACTIVE' | 'SUSPENDED' | 'RETIRED' | 'TRANSFERRED';
  quantityAvailable: number;
  quantityReserved: number;
  quantityTransferred: number;
  quantityRetired: number;
  issuer: 'BEE';
  registry: 'ICM';
  authoritativeIssuanceReference: string;
  serialNumber: string;
  sellerIcmRegistered: boolean;
  buyerIcmRegistered: boolean;
  buyerEligibleForPurchase: boolean;
  externalTransferConfirmed?: boolean;
};

export type TradabilityDecision = {
  eligible: boolean;
  reason?: string;
};

/**
 * RupayKg marketplace gate for CCCs.
 *
 * RupayKg is not the ICM Registry and must not represent an internal
 * marketplace event as an authoritative ICM transfer. CCC trading must
 * remain subject to the applicable ICM/CERC process.
 */
export function evaluateCccTradability(input: CccTradabilityInput): TradabilityDecision {
  if (input.custodyStatus !== 'CUSTODY_ACTIVE') {
    return { eligible: false, reason: 'CUSTODY_NOT_ACTIVE' };
  }
  if (input.issuer !== 'BEE' || input.registry !== 'ICM') {
    return { eligible: false, reason: 'AUTHORITATIVE_ISSUER_REGISTRY_MISMATCH' };
  }
  if (!input.authoritativeIssuanceReference || !input.serialNumber) {
    return { eligible: false, reason: 'MISSING_AUTHORITATIVE_ISSUANCE_REFERENCE' };
  }
  if (!input.sellerIcmRegistered) {
    return { eligible: false, reason: 'SELLER_NOT_REGISTERED_ON_ICM' };
  }
  if (input.quantityAvailable <= 0) {
    return { eligible: false, reason: 'NO_AVAILABLE_QUANTITY' };
  }
  if (input.quantityAvailable + input.quantityReserved + input.quantityTransferred + input.quantityRetired <= 0) {
    return { eligible: false, reason: 'INVALID_CUSTODY_STATE' };
  }
  return { eligible: true };
}

export function evaluateCccBuyerEligibility(input: Pick<CccTradabilityInput, 'buyerIcmRegistered' | 'buyerEligibleForPurchase'>): TradabilityDecision {
  if (!input.buyerIcmRegistered) {
    return { eligible: false, reason: 'BUYER_NOT_REGISTERED_ON_ICM' };
  }
  if (!input.buyerEligibleForPurchase) {
    return { eligible: false, reason: 'BUYER_NOT_ELIGIBLE' };
  }
  return { eligible: true };
}

export function confirmAuthoritativeCccTransfer(input: Pick<CccTradabilityInput, 'externalTransferConfirmed'>): TradabilityDecision {
  if (!input.externalTransferConfirmed) {
    return { eligible: false, reason: 'AUTHORITATIVE_TRANSFER_NOT_CONFIRMED' };
  }
  return { eligible: true };
}
