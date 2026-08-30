export type GcpCommercialState =
  | "CUSTODY_ACTIVE"
  | "LISTED"
  | "RESERVED"
  | "TRANSFER_PENDING"
  | "TRANSFER_CONFIRMED"
  | "RECONCILED"
  | "SETTLED"
  | "RETIRED";

const transitions: Record<GcpCommercialState, GcpCommercialState[]> = {
  CUSTODY_ACTIVE: ["LISTED"],
  LISTED: ["RESERVED"],
  RESERVED: ["TRANSFER_PENDING"],
  TRANSFER_PENDING: ["TRANSFER_CONFIRMED"],
  TRANSFER_CONFIRMED: ["RECONCILED"],
  RECONCILED: ["SETTLED"],
  SETTLED: ["RETIRED"],
  RETIRED: [],
};

export function assertGcpCommercialTransition(
  from: GcpCommercialState,
  to: GcpCommercialState
): void {
  if (!transitions[from].includes(to)) {
    throw new Error(`GCP_INVALID_TRANSITION:${from}->${to}`);
  }
}

export function advanceGcpCommercialState(
  from: GcpCommercialState,
  to: GcpCommercialState
): GcpCommercialState {
  assertGcpCommercialTransition(from, to);
  return to;
}
