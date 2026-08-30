/**
 * Authoritative registry boundary.
 *
 * This interface deliberately contains no synthetic/default implementation.
 * Production adapters must obtain facts from the applicable authoritative
 * programme before custody, transfer, reconciliation or retirement is committed.
 */
import type { CreditType, Registry } from './environmentalCreditRepository.ts';

export interface AuthoritativeHolding {
  creditType: CreditType;
  registry: Registry;
  registryAccountId: string;
  creditReference: string;
  holderEntityId: string;
  quantity: number;
  tradabilityStatus: 'TRADABLE' | 'NON_TRADABLE';
  verifiedAt: string;
  authoritativeSourceReference: string;
}

export interface AuthoritativeTransferConfirmation {
  creditType: CreditType;
  registry: Registry;
  creditReference: string;
  buyerEntityId: string;
  quantity: number;
  buyerEligibilityVerified: boolean;
  authoritativeTransactionReference: string;
  confirmedAt: string;
}

export interface AuthoritativeRetirementConfirmation {
  creditType: CreditType;
  registry: Registry;
  creditReference: string;
  holderEntityId: string;
  quantity: number;
  authoritativeRetirementReference: string;
  confirmedAt: string;
}

export interface CreditRegistryAdapter {
  readonly registry: Registry;
  verifyHolding(creditReference: string, expectedHolderEntityId: string): Promise<AuthoritativeHolding>;
  verifyBuyerEligibility(buyerEntityId: string, creditType: CreditType): Promise<boolean>;
  transfer(input: { creditReference: string; quantity: number; buyerEntityId: string }): Promise<AuthoritativeTransferConfirmation>;
  reconcile(creditReference: string, expectedHolderEntityId: string): Promise<AuthoritativeHolding>;
  retire(input: { creditReference: string; quantity: number; holderEntityId: string; reason: string }): Promise<AuthoritativeRetirementConfirmation>;
}

/** Fail-closed until a real BEE/ICM or GCP/ICFRE adapter is configured. */
export function getAuthoritativeRegistryAdapter(_registry: Registry): CreditRegistryAdapter {
  throw new Error('AUTHORITATIVE_REGISTRY_NOT_CONFIGURED');
}
