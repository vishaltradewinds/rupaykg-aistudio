import crypto from 'crypto';
import { getGcpCommercialState, recordGcpCommercialTransition } from '../src/services/gcpCommercialLifecycleLedger.ts';

const positionId = `ledger-test-${crypto.randomUUID()}`;
const states = [
  'CUSTODY_ACTIVE', 'LISTED', 'RESERVED', 'TRANSFER_PENDING',
  'TRANSFER_CONFIRMED', 'RECONCILED', 'SETTLED', 'RETIRED',
] as const;

for (let i = 0; i < states.length; i += 1) {
  await recordGcpCommercialTransition({
    positionId,
    toState: states[i],
    eventType: `TEST_${states[i]}`,
    idempotencyKey: `ledger-test:${positionId}:${states[i]}`,
    metadata: i === 4 ? { continuationOfPositionId: i === 4 ? 'source-position' : undefined } : {},
  });
}

const current = await getGcpCommercialState(positionId);
if (current !== 'RETIRED') throw new Error(`GCP_LIFECYCLE_LEDGER_FINAL_STATE_FAILED:${current}`);

let invalidRejected = false;
try {
  await recordGcpCommercialTransition({
    positionId,
    toState: 'RESERVED',
    eventType: 'INVALID_BACKWARD_TRANSITION',
    idempotencyKey: `ledger-test:${positionId}:invalid`,
  });
} catch { invalidRejected = true; }
if (!invalidRejected) throw new Error('GCP_LIFECYCLE_LEDGER_ACCEPTED_INVALID_TRANSITION');

console.log('GCP COMMERCIAL LIFECYCLE LEDGER TEST: PASSED');
