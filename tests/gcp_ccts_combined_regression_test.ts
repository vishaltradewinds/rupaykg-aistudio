import { assertGcpCommercialTransition } from '../src/services/gcpCommercialLifecycle';
import { getAuthoritativeRegistryAdapter } from '../src/services/authoritativeCreditRegistry';
import { GcpCommercialIntegration } from '../src/services/gcpCommercialIntegration';

const gcpStates = [
  'CUSTODY_ACTIVE', 'LISTED', 'RESERVED', 'TRANSFER_PENDING',
  'TRANSFER_CONFIRMED', 'RECONCILED', 'SETTLED', 'RETIRED',
] as const;

for (let i = 0; i < gcpStates.length - 1; i += 1) {
  assertGcpCommercialTransition(gcpStates[i], gcpStates[i + 1]);
}

for (const [from, to] of [
  ['CUSTODY_ACTIVE', 'RESERVED'],
  ['LISTED', 'TRANSFER_PENDING'],
  ['RESERVED', 'TRANSFER_CONFIRMED'],
  ['TRANSFER_PENDING', 'RECONCILED'],
  ['TRANSFER_CONFIRMED', 'SETTLED'],
  ['RECONCILED', 'RETIRED'],
] as const) {
  let rejected = false;
  try { assertGcpCommercialTransition(from, to); } catch { rejected = true; }
  if (!rejected) throw new Error(`INVALID_GCP_TRANSITION_ACCEPTED:${from}->${to}`);
}

const integration = Object.create(GcpCommercialIntegration.prototype) as GcpCommercialIntegration;
const rejectedSettlement = integration.settle({
  reservationActive: true,
  authoritativeTransferConfirmed: false,
  reconciled: true,
  tradeValue: 100,
  currency: 'INR',
});
if (rejectedSettlement.settled || rejectedSettlement.reason !== 'AUTHORITATIVE_TRANSFER_NOT_CONFIRMED') {
  throw new Error('SETTLEMENT_AUTHORITY_GATE_FAILED');
}

const settled = integration.settle({
  reservationActive: true,
  authoritativeTransferConfirmed: true,
  reconciled: true,
  tradeValue: 100.009,
  currency: 'INR',
});
if (!settled.settled || settled.amount !== 100.01) throw new Error('SETTLEMENT_ROUNDING_FAILED');

let failClosed = false;
try { getAuthoritativeRegistryAdapter('GCP_ICFRE'); } catch (error: any) {
  failClosed = error?.message === 'AUTHORITATIVE_REGISTRY_NOT_CONFIGURED';
}
if (!failClosed) throw new Error('AUTHORITATIVE_REGISTRY_FAIL_CLOSED_FAILED');

console.log('CCTS + GCP COMBINED REGRESSION: PASSED');
