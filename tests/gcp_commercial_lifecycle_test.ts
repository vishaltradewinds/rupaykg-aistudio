import {
  advanceGcpCommercialState,
  assertGcpCommercialTransition,
  type GcpCommercialState,
} from "../src/services/gcpCommercialLifecycle";

const path: GcpCommercialState[] = [
  "CUSTODY_ACTIVE",
  "LISTED",
  "RESERVED",
  "TRANSFER_PENDING",
  "TRANSFER_CONFIRMED",
  "RECONCILED",
  "SETTLED",
  "RETIRED",
];

for (let i = 0; i < path.length - 1; i++) {
  if (advanceGcpCommercialState(path[i], path[i + 1]) !== path[i + 1]) {
    throw new Error(`GCP_TRANSITION_FAILED:${path[i]}->${path[i + 1]}`);
  }
}

const invalid: [GcpCommercialState, GcpCommercialState][] = [
  ["CUSTODY_ACTIVE", "RESERVED"],
  ["LISTED", "TRANSFER_PENDING"],
  ["RESERVED", "SETTLED"],
  ["TRANSFER_PENDING", "SETTLED"],
  ["TRANSFER_CONFIRMED", "SETTLED"],
  ["RECONCILED", "RETIRED"],
  ["RETIRED", "LISTED"],
];

for (const [from, to] of invalid) {
  let rejected = false;
  try {
    assertGcpCommercialTransition(from, to);
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error(`GCP_INVALID_TRANSITION_ACCEPTED:${from}->${to}`);
}

console.log("GCP COMMERCIAL LIFECYCLE ADVERSARIAL TEST: PASSED");
