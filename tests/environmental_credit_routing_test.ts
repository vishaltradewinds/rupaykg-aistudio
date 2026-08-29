import assert from "node:assert/strict";
import { EnvironmentalCreditService } from "../src/services/environmentalCreditService";
import { ICMComplianceService } from "../src/services/icmComplianceService";

// Current BEE catalogue: landfill methane recovery is a Waste Handling and Disposal methodology.
const landfill = ICMComplianceService.getMethodology("Waste Handling and Disposal", "BM WA03.001");
assert.equal(landfill?.methodologyId, "BM WA03.001");

// Rural livestock/manure activity routes to the current Agriculture methodology,
// but remains a project-review state rather than an automatic CCC claim.
const rural = EnvironmentalCreditService.route({
  context: "rural",
  activityType: "livestock manure",
  wasteType: "Livestock Manure"
});
assert.equal(rural.pathway, "CCTS_CCC");
assert.equal(rural.methodologyId, "BM AG04.001");
assert.equal(rural.eligible, false);
assert.equal(rural.status, "needs_project_review");

// Tree plantation uses the notified GCP methodology but is not treated as an issued credit.
const green = EnvironmentalCreditService.route({
  context: "rural",
  activityType: "tree plantation",
  greenCreditMethodologyId: "GCP-TREE-PLANTATION-2024"
});
assert.equal(green.pathway, "GREEN_CREDIT");
assert.equal(green.eligible, true);
assert.equal(green.status, "needs_project_review");
assert.equal(green.issuer, "ICFRE / Green Credit Programme process");

// Unsupported activities remain MRV-only instead of being assigned a fabricated methodology.
const unsupported = EnvironmentalCreditService.route({
  context: "urban",
  activityType: "dry recyclable sorting",
  wasteType: "Plastic Waste"
});
assert.equal(unsupported.pathway, "MRV_ONLY");
assert.equal(unsupported.eligible, false);

// ACVA validation must use a currently registered BEE ACVA and sector accreditation.
assert.equal(ICMComplianceService.isAcvaAccreditedForSector("ACVA001", "Waste Handling and Disposal"), true);
assert.equal(ICMComplianceService.isAcvaAccreditedForSector("ACVA003", "Waste Handling and Disposal"), false);

console.log("Environmental credit routing tests: PASS");
