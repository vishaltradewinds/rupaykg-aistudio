import assert from "node:assert/strict";
import {
  BEE_CCTS_APPROVED_METHODOLOGIES,
  isBEEApprovedCctsMethodology,
  isAcvaEligibleForMethodology,
  assertCctsVerificationEligibility,
} from "../src/services/cctsOfficialRegistry.ts";

assert.equal(BEE_CCTS_APPROVED_METHODOLOGIES.length, 8);
assert.equal(isBEEApprovedCctsMethodology("BM WA03.001"), true);
assert.equal(isBEEApprovedCctsMethodology("BM WA03.003"), false);
assert.equal(isBEEApprovedCctsMethodology("BM AG04.002"), false);
assert.equal(isBEEApprovedCctsMethodology("BM FR05.002"), false);

assert.equal(
  isAcvaEligibleForMethodology("BM WA03.001", ["Energy", "Industries", "Waste handling and disposal"]),
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
      methodologyCode: "BM WA03.003",
      acvaOffsetSectors: ["Waste handling and disposal"],
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
