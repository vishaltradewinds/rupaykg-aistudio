/**
 * Green Credit Programme -> RupayKg custody authority boundary.
 *
 * This is intentionally separate from CCTS/CCC authority. RupayKg does not
 * mint Green Credits and must only admit a credit backed by an authoritative
 * GCP/ICFRE issuance record.
 */

export type GcpAuthoritativeIssuance = {
  projectId: string;
  activityCode: string;
  quantity: number;
  unit: "green_credit";
  programme: "GCP";
  authority: "ICFRE";
  issuanceReference: string;
  serialNumber: string;
  issuedAt: string;
};

export type GcpCustodyAdmission = GcpAuthoritativeIssuance & {
  custodyStatus: "CUSTODY_ACTIVE";
  source: "GCP_ICFRE";
};

export function assertAuthoritativeGcpIssuance(
  issuance: GcpAuthoritativeIssuance
): void {
  if (!issuance.projectId.trim()) throw new Error("GCP_PROJECT_ID_REQUIRED");
  if (!issuance.activityCode.trim()) throw new Error("GCP_ACTIVITY_REQUIRED");
  if (!Number.isFinite(issuance.quantity) || issuance.quantity <= 0) {
    throw new Error("GCP_ISSUED_QUANTITY_INVALID");
  }
  if (issuance.unit !== "green_credit") throw new Error("GCP_UNIT_INVALID");
  if (issuance.programme !== "GCP") throw new Error("GCP_PROGRAMME_NOT_AUTHORITATIVE");
  if (issuance.authority !== "ICFRE") throw new Error("GCP_AUTHORITY_NOT_AUTHORITATIVE");
  if (!issuance.issuanceReference.trim()) {
    throw new Error("GCP_ISSUANCE_REFERENCE_REQUIRED");
  }
  if (!issuance.serialNumber.trim()) throw new Error("GCP_SERIAL_REQUIRED");

  const issuedAt = Date.parse(issuance.issuedAt);
  if (!Number.isFinite(issuedAt)) throw new Error("GCP_ISSUED_AT_INVALID");
}

export function buildGcpCustodyAdmission(
  issuance: GcpAuthoritativeIssuance
): GcpCustodyAdmission {
  assertAuthoritativeGcpIssuance(issuance);
  return {
    ...issuance,
    custodyStatus: "CUSTODY_ACTIVE",
    source: "GCP_ICFRE",
  };
}
