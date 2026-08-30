import { strict as assert } from 'node:assert';
import { assertLifecycleGate, assertCreditIssuerBoundary } from '../src/services/environmentalCreditLifecycle.ts';

const base = {
  creditType: 'CCC' as const,
  urbanOrRural: 'URBAN' as const,
  mrvVerified: true,
  methodologyId: 'BM WA03.001',
  methodologyApproved: true,
  acvaRequired: true,
  acvaVerified: true,
  authoritativeIssued: true,
  authoritativeHolderConfirmed: true,
  tradable: true,
  buyerEligible: true,
  authoritativeTransferConfirmed: true,
  reconciled: true,
  settled: true,
  retired: true,
};

assert.doesNotThrow(() => assertLifecycleGate(base, 'AUTHORITATIVE_ISSUANCE'));
assert.doesNotThrow(() => assertLifecycleGate(base, 'RETIREMENT'));
assert.throws(() => assertLifecycleGate({ ...base, authoritativeIssued: false }, 'CUSTODY'), /AUTHORITATIVE_ISSUANCE/);
assert.throws(() => assertLifecycleGate({ ...base, acvaVerified: false }, 'AUTHORITATIVE_ISSUANCE'), /ACVA_VERIFICATION/);
assert.throws(() => assertLifecycleGate({ ...base, buyerEligible: false }, 'AUTHORITATIVE_TRANSFER'), /BUYER_ELIGIBILITY/);
assert.throws(() => assertLifecycleGate({ ...base, authoritativeTransferConfirmed: false }, 'RECONCILIATION'), /AUTHORITATIVE_TRANSFER/);
assert.doesNotThrow(() => assertCreditIssuerBoundary('CCC', 'BEE_ICM'));
assert.doesNotThrow(() => assertCreditIssuerBoundary('GREEN_CREDIT', 'GCP_ICFRE'));
assert.throws(() => assertCreditIssuerBoundary('CCC', 'GCP_ICFRE'), /Invalid issuer boundary/);
assert.throws(() => assertCreditIssuerBoundary('GREEN_CREDIT', 'BEE_ICM'), /Invalid issuer boundary/);

console.log('Environmental credit lifecycle gate tests: PASS');
