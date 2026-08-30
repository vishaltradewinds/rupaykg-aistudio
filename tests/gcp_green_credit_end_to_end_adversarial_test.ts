import {
  assertAuthoritativeGcpIssuance,
  buildGcpCustodyAdmission,
  type GcpAuthoritativeIssuance,
} from "../src/services/gcpGreenCreditAuthorityGate";

const valid: GcpAuthoritativeIssuance = {
  projectId: "GCP-PROJECT-001",
  activityCode: "TREE_COVER",
  quantity: 100,
  unit: "green_credit",
  programme: "GCP",
  authority: "ICFRE",
  issuanceReference: "GCP-ISS-001",
  serialNumber: "GCP-SERIAL-001",
  issuedAt: "2026-08-30T10:00:00Z",
};

function expectReject(label: string, value: GcpAuthoritativeIssuance): void {
  let rejected = false;
  try {
    assertAuthoritativeGcpIssuance(value);
  } catch {
    rejected = true;
  }
  if (!rejected) throw new Error(`EXPECTED_REJECTION_FAILED:${label}`);
}

assertAuthoritativeGcpIssuance(valid);
const custody = buildGcpCustodyAdmission(valid);
if (custody.custodyStatus !== "CUSTODY_ACTIVE") throw new Error("GCP_CUSTODY_NOT_ACTIVE");
if (custody.source !== "GCP_ICFRE") throw new Error("GCP_CUSTODY_SOURCE_INVALID");

expectReject("wrong-programme", { ...valid, programme: "CCTS" as "GCP" });
expectReject("wrong-authority", { ...valid, authority: "BEE" as "ICFRE" });
expectReject("wrong-unit", { ...valid, unit: "tCO2e" as "green_credit" });
expectReject("missing-reference", { ...valid, issuanceReference: "" });
expectReject("missing-serial", { ...valid, serialNumber: "" });
expectReject("zero-quantity", { ...valid, quantity: 0 });
expectReject("invalid-timestamp", { ...valid, issuedAt: "not-a-date" });

// A valid GCP admission is explicitly bound to GCP/ICFRE.
if (custody.source !== "GCP_ICFRE") throw new Error("GCP_CCTS_AUTHORITY_COLLISION");

console.log("GCP END-TO-END AUTHORITY/CUSTODY ADVERSARIAL TEST: PASSED");
