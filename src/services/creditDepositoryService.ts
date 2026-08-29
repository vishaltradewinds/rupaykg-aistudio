/**
 * RupayKg Enterprise 3.0 — Environmental Credit Depository
 *
 * RupayKg may hold/market credits only where the applicable authoritative
 * registry/account identifies RupayKg as the holder/owner. This service does
 * not mint credits and does not replace BEE/ICM or the Green Credit Programme.
 */

export type DepositoryCreditType = 'CCC' | 'GREEN_CREDIT';
export type CustodyStatus = 'PENDING_REGISTRY_CONFIRMATION' | 'HELD' | 'RESERVED_FOR_SALE' | 'TRANSFER_PENDING' | 'TRANSFERRED' | 'RETIRED' | 'BLOCKED';
export type Tradability = 'TRADABLE' | 'NON_TRADABLE' | 'UNKNOWN';

export interface DepositoryCreditLot {
  lotId: string;
  creditType: DepositoryCreditType;
  quantity: number;
  methodologyId?: string;
  projectId: string;
  authoritativeRegistry: 'BEE_ICM' | 'GCP_ICFRE';
  authoritativeAccountId: string;
  authoritativeCreditReference: string;
  serialRangeOrCertificateReference: string;
  holderEntityId: string;
  custodyStatus: CustodyStatus;
  tradability: Tradability;
  registryVerifiedAt: string;
  availableQuantity: number;
  reservedQuantity: number;
  transferredQuantity: number;
  retiredQuantity: number;
  provenanceHash?: string;
}

export interface CreditSaleWaterfall {
  grossProceedsInr: number;
  transactionCostsInr: number;
  registryIssuanceCostsInr: number;
  acvaValidationVerificationCostsInr: number;
  projectOwnerShareInr: number;
  generatorAggregatorShareInr: number;
  financierShareInr: number;
  rupayKgRevenueInr: number;
}

export class CreditDepositoryService {
  /**
   * Creates a custody record only after an authoritative registry reference
   * and holder account are supplied. It deliberately cannot create a credit.
   */
  static acceptRegistryHolding(input: Omit<DepositoryCreditLot, 'custodyStatus' | 'availableQuantity' | 'reservedQuantity' | 'transferredQuantity' | 'retiredQuantity'>): DepositoryCreditLot {
    if (!input.authoritativeAccountId || !input.authoritativeCreditReference) {
      throw new Error('Authoritative registry account and credit reference are required');
    }
    if (!input.holderEntityId) {
      throw new Error('Authoritative holder entity is required');
    }
    if (input.quantity <= 0) {
      throw new Error('Credit quantity must be positive');
    }
    if (input.tradability === 'UNKNOWN') {
      throw new Error('Credit tradability must be established before marketplace listing');
    }

    return {
      ...input,
      custodyStatus: 'HELD',
      availableQuantity: input.quantity,
      reservedQuantity: 0,
      transferredQuantity: 0,
      retiredQuantity: 0
    };
  }

  static reserveForSale(lot: DepositoryCreditLot, quantity: number): DepositoryCreditLot {
    if (lot.custodyStatus !== 'HELD' && lot.custodyStatus !== 'RESERVED_FOR_SALE') {
      throw new Error('Only held credits may be reserved for sale');
    }
    if (lot.tradability !== 'TRADABLE') {
      throw new Error('This credit lot is not confirmed tradable');
    }
    if (quantity <= 0 || quantity > lot.availableQuantity) {
      throw new Error('Requested sale quantity exceeds available depository inventory');
    }

    return {
      ...lot,
      custodyStatus: 'RESERVED_FOR_SALE',
      availableQuantity: lot.availableQuantity - quantity,
      reservedQuantity: lot.reservedQuantity + quantity
    };
  }

  static executeSaleWaterfall(quantity: number, unitPriceInr: number): CreditSaleWaterfall {
    if (quantity <= 0 || unitPriceInr <= 0) {
      throw new Error('Quantity and unit price must be positive');
    }
    const grossProceedsInr = Number((quantity * unitPriceInr).toFixed(2));
    const transactionCostsInr = Number((grossProceedsInr * 0.01).toFixed(2));
    const registryIssuanceCostsInr = Number((grossProceedsInr * 0.015).toFixed(2));
    const acvaValidationVerificationCostsInr = Number((grossProceedsInr * 0.025).toFixed(2));
    const projectOwnerShareInr = Number((grossProceedsInr * 0.35).toFixed(2));
    const generatorAggregatorShareInr = Number((grossProceedsInr * 0.05).toFixed(2));
    const financierShareInr = Number((grossProceedsInr * 0.02).toFixed(2));
    const rupayKgRevenueInr = Number((grossProceedsInr * 0.53).toFixed(2));

    return {
      grossProceedsInr,
      transactionCostsInr,
      registryIssuanceCostsInr,
      acvaValidationVerificationCostsInr,
      projectOwnerShareInr,
      generatorAggregatorShareInr,
      financierShareInr,
      rupayKgRevenueInr
    };
  }
}
