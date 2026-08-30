import assert from "node:assert/strict";
import {
  BEE_CCTS_APPROVED_METHODOLOGIES,
  isBEEApprovedCctsMethodology,
  isAcvaEligibleForMethodology,
  assertCctsVerificationEligibility,
} from "../src/services/cctsOfficialRegistry.ts";

// BEE's currently published Offset Mechanism catalogue contains 12 approved
// methodologies. Draft/proposed methodologies must remain non-eligible.
assert.equal(BEE_CCTS_APPROVED_METHODOLOGIES.length, 12);
assert.equal(isBEEApprovedCctsMethodology("BM WA03.001"), true);
assert.equal(isBEEApprovedCctsMethodology("BM WA03.003"), true);
assert.equal(isBEEApprovedCctsMethodology("BM AG04.002"), true);
assert.equal(isBEEApprovedCctsMethodology("BM FR05.002"), true);
assert.equal(isBEEApprovedCctsMethodology("BM UNKNOWN.999"), false);

assert.equal(
  isAcvaEligibleForMethodology("BM WA03.001", ["Energy", "Industries", "Waste Handling and Disposal"]),
  true
);
assert.equal(
  isAcvaEligibleForMethodology("BM WA03.001", ["Energy", "Forestry"]),
  false
);

assert.doesNotThrow(() =>
  assertCctsVerificationEligibility({
    methodologyCode: "BM EN01.001",
    acvaOffsetSectors: ["Energy"],
  })
);

assert.throws(
  () =>
    assertCctsVerificationEligibility({
      methodologyCode: "BM UNKNOWN.999",
      acvaOffsetSectors: ["Energy"],
    }),
  /CCTS_METHODOLOGY_NOT_APPROVED/
);

assert.throws(
  () =>
    assertCctsVerificationEligibility({
      methodologyCode: "BM WA03.001",
      acvaOffsetSectors: ["Energy"],
    }),
  /ACVA_NOT_ACCREDITED_FOR_METHODOLOGY_SECTOR/
);

console.log("CCTS official registry policy tests: PASS");
