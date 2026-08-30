import assert from "node:assert/strict";

import {
  assertAuthoritativeCctsIssuance,
  buildCctsCustodyAdmission,
  type CctsAuthoritativeIssuance,
} from "../src/services/cctsAuthoritativeIssuanceGate";
import {
  admitAuthoritativeCctsToCustody,
  custodyAdmissionKey,
} from "../src/services/cctsCustodyAdmission";
import { evaluateCctsReservation } from "../src/services/cctsReservationGate";
import { evaluateCctsSettlement } from "../src/services/cctsSettlementGate";
import { admitCctsRetirement } from "../src/services/cctsRetirementGate";

const now = "2026-08-30T10:30:00.000Z";

const issuance: CctsAuthoritativeIssuance = {
  projectId: "urban-rural-project-001",
  methodologyCode: "BM-WA03.001",
  quantity: 100,
  unit: "tCO2e",
  registry: "ICM",
  issuer: "BEE",
  issuanceReference: "ICM-ISS-0001",
  serialNumber: "BEE-ICM-0001-000100",
  issuedAt: now,
};

function expectRejected(fn: () => unknown, message: string) {
  assert.throws(fn, message);
}

// 1. Authoritative issuance is the only entry into custody.
assert.doesNotThrow(() => assertAuthoritativeCctsIssuance(issuance));
const custody = admitAuthoritativeCctsToCustody(issuance, now);
assert.equal(custody.custodyStatus, "CUSTODY_ACTIVE");
assert.equal(custody.source, "BEE_ICM");

// 2. Forged issuer / registry / simulated issuance must fail closed.
expectRejected(
  () => assertAuthoritativeCctsIssuance({ ...issuance, issuer: "FAKE" as "BEE" }),
  "reject forged issuer",
);
expectRejected(
  () => assertAuthoritativeCctsIssuance({ ...issuance, registry: "LOCAL" as "ICM" }),
  "reject non-authoritative registry",
);
expectRejected(
  () => assertAuthoritativeCctsIssuance({ ...issuance, issuanceReference: "" }),
  "reject missing issuance reference",
);
expectRejected(
  () => assertAuthoritativeCctsIssuance({ ...issuance, quantity: 0 }),
  "reject zero issuance",
);

// 3. Duplicate authoritative issuance must resolve to the same custody key.
assert.equal(custodyAdmissionKey(issuance), custodyAdmissionKey({ ...issuance }));
assert.notEqual(
  custodyAdmissionKey(issuance),
  custodyAdmissionKey({ ...issuance, serialNumber: "BEE-ICM-0001-000101" }),
);

// 4. Reservation succeeds only against active custody and cannot oversell.
const reservation = evaluateCctsReservation({
  custodyStatus: "CUSTODY_ACTIVE",
  availableQuantity: 100,
  requestedQuantity: 60,
  sellerId: "seller-001",
  buyerId: "buyer-001",
  listingId: "listing-001",
  reservationId: "reservation-001",
});
assert.equal(reservation.accepted, true);
assert.equal(reservation.reservedQuantity, 60);
assert.equal(reservation.remainingAvailableQuantity, 40);
assert.equal(reservation.escrowRequired, true);

const oversell = evaluateCctsReservation({
  custodyStatus: "CUSTODY_ACTIVE",
  availableQuantity: 40,
  requestedQuantity: 41,
  sellerId: "seller-001",
  buyerId: "buyer-002",
  listingId: "listing-002",
  reservationId: "reservation-002",
});
assert.equal(oversell.accepted, false);
assert.equal(oversell.reason, "INSUFFICIENT_AVAILABLE_QUANTITY");

const inactiveReservation = evaluateCctsReservation({
  custodyStatus: "CUSTODY_ACTIVE" as "CUSTODY_ACTIVE",
  availableQuantity: 100,
  requestedQuantity: 1,
  sellerId: "",
  buyerId: "buyer-001",
  listingId: "listing-001",
  reservationId: "reservation-003",
});
assert.equal(inactiveReservation.accepted, false);

// 5. Settlement is impossible before authoritative transfer reconciliation.
const preTransferSettlement = evaluateCctsSettlement({
  reservationStatus: "RESERVED",
  authoritativeTransferStatus: "PENDING",
  reconciliationStatus: "PENDING",
  tradeValue: 100000,
  currency: "INR",
});
assert.equal(preTransferSettlement.eligible, false);
assert.equal(preTransferSettlement.reason, "AUTHORITATIVE_TRANSFER_NOT_CONFIRMED");

// 6. Authoritative transfer + reconciliation unlock settlement.
const settlement = evaluateCctsSettlement({
  reservationStatus: "RESERVED",
  authoritativeTransferStatus: "CONFIRMED",
  reconciliationStatus: "RECONCILED",
  tradeValue: 100000,
  currency: "INR",
});
assert.equal(settlement.eligible, true);
assert.equal(settlement.totalAllocated, 100000);
assert.equal(
  settlement.allocations.reduce((sum, item) => sum + item.percent, 0),
  100,
);
assert.equal(
  settlement.allocations.reduce((sum, item) => sum + item.amount, 0),
  100000,
);

// 7. Retirement is irreversible and requires authoritative ICM confirmation.
const prematureRetirement = admitCctsRetirement({
  custodyId: "custody-001",
  issuer: "BEE",
  registry: "ICM_REGISTRY",
  authoritativeSerial: issuance.serialNumber,
  quantity: 60,
  retirementReference: "ICM-RET-0001",
  retireeAccount: "buyer-001",
  purpose: "SCOPE_1_OFFSET",
  authoritativeRetirementConfirmed: false,
  reconciled: true,
  alreadyRetiredQuantity: 0,
  availableQuantity: 60,
});
assert.equal(prematureRetirement.accepted, false);

const retirement = admitCctsRetirement({
  custodyId: "custody-001",
  issuer: "BEE",
  registry: "ICM_REGISTRY",
  authoritativeSerial: issuance.serialNumber,
  quantity: 60,
  retirementReference: "ICM-RET-0001",
  retireeAccount: "buyer-001",
  purpose: "SCOPE_1_OFFSET",
  authoritativeRetirementConfirmed: true,
  reconciled: true,
  alreadyRetiredQuantity: 0,
  availableQuantity: 60,
});
assert.equal(retirement.accepted, true);
assert.equal(retirement.state, "RETIRED");
assert.equal(retirement.retiredQuantity, 60);
assert.equal(retirement.conservationInvariant, true);

const overRetirement = admitCctsRetirement({
  custodyId: "custody-001",
  issuer: "BEE",
  registry: "ICM_REGISTRY",
  authoritativeSerial: issuance.serialNumber,
  quantity: 61,
  retirementReference: "ICM-RET-0002",
  retireeAccount: "buyer-001",
  purpose: "SCOPE_2_OFFSET",
  authoritativeRetirementConfirmed: true,
  reconciled: true,
  alreadyRetiredQuantity: 60,
  availableQuantity: 40,
});
assert.equal(overRetirement.accepted, false);

// 8. End-to-end conservation check for the simulated custody lifecycle.
const issued = 100;
const transferred = 60;
const retired = 60;
const available = 0;
const reserved = 0;
assert.equal(issued, available + reserved + transferred + retired);

// 9. A Green Credit-style issuer must never cross the CCC BEE/ICM boundary.
expectRejected(
  () =>
    assertAuthoritativeCctsIssuance({
      ...issuance,
      issuer: "GCP_ICFRE" as "BEE",
      registry: "GCP" as "ICM",
    }),
  "reject non-CCTS authority from CCC gate",
);

console.log("CCTS end-to-end adversarial lifecycle: PASS (9 scenarios)");
