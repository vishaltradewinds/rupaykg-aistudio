/**
 * Authoritative CCTS issuance -> RupayKg custody admission boundary.
 *
 * RupayKg never mints CCCs. A credit may enter custody only after an
 * authoritative BEE/ICM issuance record has been supplied and validated.
 * Local verification, simulated serials, or ACVA approval alone are never
 * sufficient to create custody.
 */

export type CctsAuthoritativeIssuance = {
  projectId: string;
  methodologyCode: string;
  quantity: number;
  unit: "tCO2e";
  registry: "ICM";
  issuer: "BEE";
  issuanceReference: string;
  serialNumber: string;
  issuedAt: string;
};

export type CctsCustodyAdmission = CctsAuthoritativeIssuance & {
  custodyStatus: "CUSTODY_ACTIVE";
  source: "BEE_ICM";
};

/**
 * Fail-closed admission check. This validates the shape and provenance of an
 * already-authoritative issuance event; it does not call or impersonate ICM.
 */
export function assertAuthoritativeCctsIssuance(
  issuance: CctsAuthoritativeIssuance
): void {
  if (!issuance.projectId.trim()) throw new Error("CCTS_PROJECT_ID_REQUIRED");
  if (!issuance.methodologyCode.trim()) throw new Error("CCTS_METHODOLOGY_REQUIRED");
  if (!Number.isFinite(issuance.quantity) || issuance.quantity <= 0) {
    throw new Error("CCTS_ISSUED_QUANTITY_INVALID");
  }
  if (issuance.unit !== "tCO2e") throw new Error("CCTS_UNIT_INVALID");
  if (issuance.registry !== "ICM") throw new Error("CCTS_REGISTRY_NOT_AUTHORITATIVE");
  if (issuance.issuer !== "BEE") throw new Error("CCTS_ISSUER_NOT_AUTHORITATIVE");
  if (!issuance.issuanceReference.trim()) {
    throw new Error("CCTS_ISSUANCE_REFERENCE_REQUIRED");
  }
  if (!issuance.serialNumber.trim()) throw new Error("CCTS_SERIAL_REQUIRED");

  const issuedAt = Date.parse(issuance.issuedAt);
  if (!Number.isFinite(issuedAt)) throw new Error("CCTS_ISSUED_AT_INVALID");
}

export function buildCctsCustodyAdmission(
  issuance: CctsAuthoritativeIssuance
): CctsCustodyAdmission {
  assertAuthoritativeCctsIssuance(issuance);

  return {
    ...issuance,
    custodyStatus: "CUSTODY_ACTIVE",
    source: "BEE_ICM",
  };
}
