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
  methodologyApproved: boolean;
  acvaRequired: boolean;
  acvaVerified: boolean;
  authoritativeIssued: boolean;
  authoritativeHolderConfirmed: boolean;
  tradable: boolean;
  buyerEligible: boolean;
  authoritativeTransferConfirmed: boolean;
  reconciled: boolean;
  settled: boolean;
  retired: boolean;
}

const STAGE_ORDER: LifecycleStage[] = [
  'MRV', 'METHODOLOGY', 'ACVA_VERIFICATION', 'AUTHORITATIVE_ISSUANCE', 'CUSTODY',
  'MARKETPLACE', 'BUYER_ELIGIBILITY', 'AUTHORITATIVE_TRANSFER', 'RECONCILIATION',
  'SETTLEMENT', 'RETIREMENT',
];

export function assertLifecycleGate(input: LifecycleGateInput, target: LifecycleStage): void {
  if (!['CCC', 'GREEN_CREDIT'].includes(input.creditType)) throw new Error('Unsupported environmental credit type');
  if (!['URBAN', 'RURAL'].includes(input.urbanOrRural)) throw new Error('Operating context must be URBAN or RURAL');
  if (!input.methodologyId?.trim() || !input.methodologyApproved) throw new Error('An approved applicable methodology is required');

  const acvaGate = !input.acvaRequired || input.acvaVerified;
  const checks: Record<LifecycleStage, boolean> = {
    MRV: input.mrvVerified,
    METHODOLOGY: input.mrvVerified && Boolean(input.methodologyId) && input.methodologyApproved,
    ACVA_VERIFICATION: input.mrvVerified && input.methodologyApproved && acvaGate,
    AUTHORITATIVE_ISSUANCE: input.mrvVerified && input.methodologyApproved && acvaGate && input.authoritativeIssued,
    CUSTODY: input.authoritativeIssued && input.authoritativeHolderConfirmed,
    MARKETPLACE: input.authoritativeIssued && input.authoritativeHolderConfirmed && input.tradable,
    BUYER_ELIGIBILITY: input.authoritativeIssued && input.authoritativeHolderConfirmed && input.tradable && input.buyerEligible,
    AUTHORITATIVE_TRANSFER: input.authoritativeIssued && input.authoritativeHolderConfirmed && input.tradable && input.buyerEligible && input.authoritativeTransferConfirmed,
    RECONCILIATION: input.authoritativeTransferConfirmed && input.reconciled,
    SETTLEMENT: input.reconciled && input.settled,
    RETIREMENT: input.reconciled && input.settled && input.retired,
  };

  const targetIndex = STAGE_ORDER.indexOf(target);
  for (let i = 0; i <= targetIndex; i += 1) {
    const stage = STAGE_ORDER[i];
    if (!checks[stage]) throw new Error(`Lifecycle gate not satisfied: ${stage}`);
  }
}

export function assertCreditIssuerBoundary(creditType: CreditType, issuer: 'BEE_ICM' | 'GCP_ICFRE'): void {
  const expected = creditType === 'CCC' ? 'BEE_ICM' : 'GCP_ICFRE';
  if (issuer !== expected) throw new Error(`Invalid issuer boundary: ${creditType} must originate from ${expected}`);
}
