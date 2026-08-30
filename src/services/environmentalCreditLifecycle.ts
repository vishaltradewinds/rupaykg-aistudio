import type { CreditType } from './environmentalCreditRepository.ts';

export type LifecycleStage =
  | 'MRV'
  | 'METHODOLOGY'
  | 'ACVA_VERIFICATION'
  | 'AUTHORITATIVE_ISSUANCE'
  | 'CUSTODY'
  | 'MARKETPLACE'
  | 'BUYER_ELIGIBILITY'
  | 'AUTHORITATIVE_TRANSFER'
  | 'RECONCILIATION'
  | 'SETTLEMENT'
  | 'RETIREMENT';

export interface LifecycleGateInput {
  creditType: CreditType;
  urbanOrRural: 'URBAN' | 'RURAL';
  mrvVerified: boolean;
  methodologyId: string | null;
  acvaVerified: boolean;
  authoritativeIssued: boolean;
  authoritativeHolderConfirmed: boolean;
  tradable: boolean;
  buyerEligible: boolean;
  authoritativeTransferConfirmed: boolean;
  reconciled: boolean;
  settled: boolean;
}

export function assertLifecycleGate(input: LifecycleGateInput, target: LifecycleStage): void {
  if (!['URBAN', 'RURAL'].includes(input.urbanOrRural)) throw new Error('Operating context must be URBAN or RURAL');
  if (!input.methodologyId?.trim()) throw new Error('Applicable methodology is required');
  const checks: Record<LifecycleStage, boolean> = {
    MRV: input.mrvVerified,
    METHODOLOGY: Boolean(input.methodologyId),
    ACVA_VERIFICATION: input.acvaVerified,
    AUTHORITATIVE_ISSUANCE: input.authoritativeIssued,
    CUSTODY: input.authoritativeHolderConfirmed,
    MARKETPLACE: input.authoritativeHolderConfirmed && input.tradable,
    BUYER_ELIGIBILITY: input.buyerEligible,
    AUTHORITATIVE_TRANSFER: input.authoritativeTransferConfirmed,
    RECONCILIATION: input.reconciled,
    SETTLEMENT: input.reconciled && input.settled,
    RETIREMENT: input.reconciled && input.settled,
  };
  if (!checks[target]) throw new Error(`Lifecycle gate not satisfied: ${target}`);
}
