import { GcpCommercialIntegration } from '../src/services/gcpCommercialIntegration';
import { assertGcpCommercialTransition } from '../src/services/gcpCommercialLifecycle';
import { getAuthoritativeRegistryAdapter } from '../src/services/authoritativeCreditRegistry';

const ordered = [
  'CUSTODY_ACTIVE', 'LISTED', 'RESERVED', 'TRANSFER_PENDING',
  'TRANSFER_CONFIRMED', 'RECONCILED', 'SETTLED', 'RETIRED',
] as const;

for (let i = 0; i < ordered.length - 1; i += 1) {
  assertGcpCommercialTransition(ordered[i], ordered[i + 1]);
}

const invalid = [
  ['CUSTODY_ACTIVE', 'RESERVED'],
  ['LISTED', 'TRANSFER_PENDING'],
  ['RESERVED', 'TRANSFER_CONFIRMED'],
  ['TRANSFER_PENDING', 'RECONCILED'],
  ['TRANSFER_CONFIRMED', 'SETTLED'],
  ['RECONCILED', 'RETIRED'],
] as const;
for (const [from, to] of invalid) {
  let rejected = false;
  try { assertGcpCommercialTransition(from, to); } catch { rejected = true; }
  if (!rejected) throw new Error(`GCP_INVALID_TRANSITION_ACCEPTED:${from}->${to}`);
}

const integration = Object.create(GcpCommercialIntegration.prototype) as GcpCommercialIntegration;
const rejectSettlement = (input: any, expected: string) => {
  const result = integration.settle(input);
  if (result.settled || result.reason !== expected) throw new Error(`GCP_SETTLEMENT_GATE_FAILED:${expected}`);
};

rejectSettlement({ reservationActive: false, authoritativeTransferConfirmed: true, reconciled: true, tradeValue: 100, currency: 'INR' }, 'SETTLEMENT_REQUIRES_ACTIVE_RESERVATION');
rejectSettlement({ reservationActive: true, authoritativeTransferConfirmed: false, reconciled: true, tradeValue: 100, currency: 'INR' }, 'AUTHORITATIVE_TRANSFER_NOT_CONFIRMED');
rejectSettlement({ reservationActive: true, authoritativeTransferConfirmed: true, reconciled: false, tradeValue: 100, currency: 'INR' }, 'CUSTODY_RECONCILIATION_NOT_COMPLETE');
const settled = integration.settle({ reservationActive: true, authoritativeTransferConfirmed: true, reconciled: true, tradeValue: 100.009, currency: 'INR' });
if (!settled.settled || settled.amount !== 100.01) throw new Error('GCP_SETTLEMENT_ROUNDING_FAILED');

let failClosed = false;
try { getAuthoritativeRegistryAdapter('GCP_ICFRE'); } catch (error: any) {
  failClosed = error?.message === 'AUTHORITATIVE_REGISTRY_NOT_CONFIGURED';
}
if (!failClosed) throw new Error('GCP_REGISTRY_DID_NOT_FAIL_CLOSED');

console.log('GCP COMMERCIAL INTEGRATION ADVERSARIAL TEST: PASSED');
