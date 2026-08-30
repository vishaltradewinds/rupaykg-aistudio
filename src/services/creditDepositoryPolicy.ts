/**
 * RupayKg Enterprise 3.0 — Environmental Credit Depository Policy
 *
 * RupayKg never issues environmental credits. It records custody only after
 * authoritative programme evidence proves holder, reference, quantity and
 * tradability. Hedera/local hashes are provenance only.
 */
export type CreditType = 'CCC' | 'GREEN_CREDIT';
export type Registry = 'BEE_ICM' | 'GCP_ICFRE';

export interface RegistryHoldingProof {
  creditType: CreditType;
  registry: Registry;
  registryAccountId: string;
  creditReference: string;
  holderEntityId: string;
  quantity: number;
  tradable: boolean;
  verifiedAt: string;
}

const EXPECTED_REGISTRY: Record<CreditType, Registry> = {
  CCC: 'BEE_ICM',
  GREEN_CREDIT: 'GCP_ICFRE',
};

export function assertIssuerBoundary(creditType: CreditType, registry: Registry): void {
  if (EXPECTED_REGISTRY[creditType] !== registry) {
    throw new Error(`Invalid authoritative issuer boundary for ${creditType}`);
  }
}

export interface CustodyPosition {
  positionId: string;
  proof: RegistryHoldingProof;
  status: 'HELD' | 'RESERVED' | 'TRANSFER_PENDING' | 'TRANSFERRED' | 'RETIRED' | 'BLOCKED';
  availableQuantity: number;
  reservedQuantity: number;
  transferredQuantity: number;
  retiredQuantity: number;
}

export function acceptAuthoritativeHolding(proof: RegistryHoldingProof): CustodyPosition {
  assertIssuerBoundary(proof.creditType, proof.registry);
  if (!proof.registryAccountId || !proof.creditReference || !proof.holderEntityId) {
    throw new Error('Authoritative registry account, credit reference and holder are required');
  }
  if (!Number.isFinite(proof.quantity) || proof.quantity <= 0) throw new Error('Credit quantity must be positive');
  if (!proof.tradable) throw new Error('Credit is not confirmed tradable');
  if (!proof.verifiedAt || Number.isNaN(Date.parse(proof.verifiedAt))) throw new Error('Authoritative verification timestamp is required');

  return {
    positionId: `${proof.registry}:${proof.creditReference}`,
    proof,
    status: 'HELD',
    availableQuantity: proof.quantity,
    reservedQuantity: 0,
    transferredQuantity: 0,
    retiredQuantity: 0,
  };
}

export function reserveForSale(position: CustodyPosition, quantity: number): CustodyPosition {
  if (position.status !== 'HELD' && position.status !== 'RESERVED') throw new Error('Only held credits may be reserved');
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > position.availableQuantity) throw new Error('Insufficient available depository inventory');
  return { ...position, status: 'RESERVED', availableQuantity: position.availableQuantity - quantity, reservedQuantity: position.reservedQuantity + quantity };
}

/** Sale proceeds only. This is the platform's contractual/commercial waterfall, not a statutory claim. */
export function calculateExistingWaterfall(grossProceedsInr: number) {
  if (!Number.isFinite(grossProceedsInr) || grossProceedsInr <= 0) throw new Error('Gross proceeds must be positive');
  const allocation = {
    paymentRails: grossProceedsInr * 0.01,
    registryCompliance: grossProceedsInr * 0.015,
    acvaVvbReserve: grossProceedsInr * 0.025,
    projectOwner: grossProceedsInr * 0.35,
    generatorAggregatorCommunity: grossProceedsInr * 0.05,
    financier: grossProceedsInr * 0.02,
    rupayKgTreasury: grossProceedsInr * 0.53,
  };
  const total = Object.values(allocation).reduce((sum, value) => sum + value, 0);
  if (Math.abs(total - grossProceedsInr) > 0.01) throw new Error('Waterfall conservation check failed');
  return allocation;
}
