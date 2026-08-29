/**
 * RupayKg Enterprise 3.0 — Environmental Credit Depository Policy
 *
 * Policy boundary: RupayKg does not issue CCCs or Green Credits. It may
 * custody/list them only after authoritative registry evidence establishes
 * RupayKg as the holder and the credit as tradable.
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
  if (!proof.registryAccountId || !proof.creditReference || !proof.holderEntityId) {
    throw new Error('Authoritative registry account, credit reference and holder are required');
  }
  if (proof.quantity <= 0) throw new Error('Credit quantity must be positive');
  if (!proof.tradable) throw new Error('Credit is not confirmed tradable');

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
  if (position.status !== 'HELD' && position.status !== 'RESERVED') {
    throw new Error('Only held credits may be reserved');
  }
  if (quantity <= 0 || quantity > position.availableQuantity) {
    throw new Error('Insufficient available depository inventory');
  }
  return {
    ...position,
    status: 'RESERVED',
    availableQuantity: position.availableQuantity - quantity,
    reservedQuantity: position.reservedQuantity + quantity,
  };
}

/** Sale proceeds only. This is deliberately separate from credit ownership. */
export function calculateExistingWaterfall(grossProceedsInr: number) {
  if (grossProceedsInr <= 0) throw new Error('Gross proceeds must be positive');
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
