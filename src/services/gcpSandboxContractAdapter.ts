import type {
  AuthoritativeHolding,
  AuthoritativeRetirementConfirmation,
  AuthoritativeTransferConfirmation,
  CreditRegistryAdapter,
} from './authoritativeCreditRegistry.ts';
import type { CreditType } from './environmentalCreditRepository.ts';

/**
 * SANDBOX-CONTRACT ONLY.
 *
 * This adapter emulates the contract boundary of GCP/ICFRE without claiming
 * to be the authoritative programme. It is injected explicitly by tests and
 * must never be returned by getAuthoritativeRegistryAdapter().
 */
export class GcpSandboxContractAdapter implements CreditRegistryAdapter {
  readonly registry = 'GCP_ICFRE' as const;
  private readonly holdings = new Map<string, AuthoritativeHolding>();
  private readonly eligibleBuyers = new Set<string>();
  private readonly transfers = new Map<string, AuthoritativeTransferConfirmation>();
  private readonly retirements = new Map<string, AuthoritativeRetirementConfirmation>();

  constructor(input: {
    creditReference: string;
    registryAccountId: string;
    holderEntityId: string;
    quantity: number;
    tradabilityStatus?: 'TRADABLE' | 'NON_TRADABLE';
    eligibleBuyers: string[];
  }) {
    if (!input.creditReference || !input.registryAccountId || !input.holderEntityId) throw new Error('GCP_SANDBOX_FIXTURE_REFERENCE_REQUIRED');
    if (!Number.isFinite(input.quantity) || input.quantity <= 0) throw new Error('GCP_SANDBOX_FIXTURE_QUANTITY_INVALID');
    const now = new Date().toISOString();
    this.holdings.set(input.creditReference, {
      registry: this.registry,
      creditType: 'GREEN_CREDIT',
      registryAccountId: input.registryAccountId,
      creditReference: input.creditReference,
      holderEntityId: input.holderEntityId,
      quantity: input.quantity,
      tradabilityStatus: input.tradabilityStatus ?? 'TRADABLE',
      verifiedAt: now,
      authoritativeSourceReference: `GCP-SANDBOX-CONTRACT:${input.creditReference}`,
    });
    for (const buyer of input.eligibleBuyers) this.eligibleBuyers.add(buyer);
  }

  async verifyHolding(creditReference: string, expectedHolderEntityId: string): Promise<AuthoritativeHolding> {
    const holding = this.holdings.get(creditReference);
    if (!holding || holding.holderEntityId !== expectedHolderEntityId || holding.quantity <= 0) throw new Error('GCP_SANDBOX_HOLDING_NOT_VERIFIED');
    return { ...holding, verifiedAt: new Date().toISOString() };
  }

  async verifyBuyerEligibility(buyerEntityId: string, creditType: CreditType): Promise<boolean> {
    return creditType === 'GREEN_CREDIT' && this.eligibleBuyers.has(buyerEntityId);
  }

  async transfer(input: { creditReference: string; quantity: number; buyerEntityId: string }): Promise<AuthoritativeTransferConfirmation> {
    const holding = this.holdings.get(input.creditReference);
    if (!holding) throw new Error('GCP_SANDBOX_HOLDING_NOT_FOUND');
    if (!this.eligibleBuyers.has(input.buyerEntityId)) throw new Error('GCP_SANDBOX_BUYER_NOT_ELIGIBLE');
    if (!Number.isFinite(input.quantity) || input.quantity <= 0 || input.quantity > holding.quantity) throw new Error('GCP_SANDBOX_TRANSFER_QUANTITY_INVALID');
    const reference = `GCP-SANDBOX-TX:${input.creditReference}:${input.buyerEntityId}:${input.quantity}`;
    const confirmation: AuthoritativeTransferConfirmation = {
      registry: this.registry,
      creditType: 'GREEN_CREDIT',
      creditReference: input.creditReference,
      buyerEntityId: input.buyerEntityId,
      quantity: input.quantity,
      buyerEligibilityVerified: true,
      authoritativeTransactionReference: reference,
      confirmedAt: new Date().toISOString(),
    };
    this.holdings.set(input.creditReference, {
      ...holding,
      holderEntityId: input.buyerEntityId,
      quantity: holding.quantity - input.quantity,
      verifiedAt: confirmation.confirmedAt,
    });
    const buyerReference = `${input.creditReference}:BUYER:${input.buyerEntityId}`;
    const existingBuyer = this.holdings.get(buyerReference);
    this.holdings.set(buyerReference, {
      ...holding,
      creditReference: buyerReference,
      holderEntityId: input.buyerEntityId,
      quantity: (existingBuyer?.quantity ?? 0) + input.quantity,
      verifiedAt: confirmation.confirmedAt,
      authoritativeSourceReference: reference,
    });
    this.transfers.set(reference, confirmation);
    return confirmation;
  }

  async reconcile(creditReference: string, expectedHolderEntityId: string): Promise<AuthoritativeHolding> {
    const holding = this.holdings.get(creditReference);
    if (!holding || holding.holderEntityId !== expectedHolderEntityId || holding.quantity < 0) throw new Error('GCP_SANDBOX_RECONCILIATION_FAILED');
    return { ...holding, verifiedAt: new Date().toISOString() };
  }

  async retire(input: { creditReference: string; quantity: number; holderEntityId: string; reason: string }): Promise<AuthoritativeRetirementConfirmation> {
    const holding = this.holdings.get(input.creditReference);
    if (!holding || holding.holderEntityId !== input.holderEntityId) throw new Error('GCP_SANDBOX_RETIREMENT_HOLDER_MISMATCH');
    if (!input.reason?.trim() || !Number.isFinite(input.quantity) || input.quantity <= 0 || input.quantity > holding.quantity) throw new Error('GCP_SANDBOX_RETIREMENT_INVALID');
    const reference = `GCP-SANDBOX-RET:${input.creditReference}:${input.quantity}`;
    const confirmation: AuthoritativeRetirementConfirmation = {
      registry: this.registry,
      creditType: 'GREEN_CREDIT',
      creditReference: input.creditReference,
      holderEntityId: input.holderEntityId,
      quantity: input.quantity,
      authoritativeRetirementReference: reference,
      confirmedAt: new Date().toISOString(),
    };
    this.holdings.set(input.creditReference, { ...holding, quantity: holding.quantity - input.quantity, verifiedAt: confirmation.confirmedAt });
    this.retirements.set(reference, confirmation);
    return confirmation;
  }

  getContractTransfer(reference: string) { return this.transfers.get(reference); }
  getContractRetirement(reference: string) { return this.retirements.get(reference); }
}
