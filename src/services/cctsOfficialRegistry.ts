/**
 * RupayKg production CCTS policy boundary.
 *
 * Source of truth: BEE's published "Methodologies and Tools under Offset
 * Mechanism" and "List of Accredited Carbon Verification Agency empanelled
 * under CCTS". This registry intentionally contains ONLY methodologies that
 * BEE currently publishes as approved for the Offset Mechanism.
 *
 * Draft PDDs, proposed methodologies, and locally invented methodology names
 * must never become production-eligible through this module.
 */

export const BEE_CCTS_APPROVED_METHODOLOGIES = [
  { code: "BM EN01.001", sector: "Energy", title: "Grid-connected electricity generation from renewable sources" },
  { code: "BM EN01.002", sector: "Energy", title: "Hydrogen production from electrolysis of water" },
  { code: "BM IN02.001", sector: "Industries", title: "Energy efficiency and fuel switching measures for industrial facilities" },
  { code: "BM IN02.002", sector: "Industries", title: "Hydrogen production using methane extracted from biogas" },
  { code: "BM WA03.001", sector: "Waste handling and disposal", title: "Landfill methane recovery" },
  { code: "BM WA03.002", sector: "Waste handling and disposal", title: "Flaring or use of landfill gas" },
  { code: "BM AG04.001", sector: "Agriculture", title: "Methane recovery from livestock and manure management at households and small farms" },
  { code: "BM FR05.001", sector: "Forestry", title: "Afforestation and reforestation of degraded mangrove habitats" }
] as const;

export type CctsApprovedMethodologyCode =
  (typeof BEE_CCTS_APPROVED_METHODOLOGIES)[number]["code"];

export const BEE_CCTS_APPROVED_METHODOLOGY_CODES = new Set<string>(
  BEE_CCTS_APPROVED_METHODOLOGIES.map((methodology) => methodology.code)
);

/**
 * Returns true only for a methodology currently published by BEE as approved.
 */
export function isBEEApprovedCctsMethodology(code: string): code is CctsApprovedMethodologyCode {
  return BEE_CCTS_APPROVED_METHODOLOGY_CODES.has(code);
}

/**
 * ACVA eligibility is sector-based. RupayKg must not infer eligibility from
 * an ACVA being registered alone; the selected methodology's sector must be
 * covered by the ACVA's current Offset Mechanism accreditation.
 */
export function isAcvaEligibleForMethodology(
  methodologyCode: string,
  accreditedOffsetSectors: readonly string[]
): boolean {
  const methodology = BEE_CCTS_APPROVED_METHODOLOGIES.find(
    (candidate) => candidate.code === methodologyCode
  );

  if (!methodology) return false;

  return accreditedOffsetSectors.some(
    (sector) => sector.trim().toLowerCase() === methodology.sector.toLowerCase()
  );
}

/**
 * A production workflow may only enter CCTS verification when both gates
 * pass: approved methodology + ACVA accreditation for its sector.
 */
export function assertCctsVerificationEligibility(input: {
  methodologyCode: string;
  acvaOffsetSectors: readonly string[];
}): void {
  if (!isBEEApprovedCctsMethodology(input.methodologyCode)) {
    throw new Error(`CCTS_METHODOLOGY_NOT_APPROVED:${input.methodologyCode}`);
  }

  if (!isAcvaEligibleForMethodology(input.methodologyCode, input.acvaOffsetSectors)) {
    throw new Error(`ACVA_NOT_ACCREDITED_FOR_METHODOLOGY_SECTOR:${input.methodologyCode}`);
  }
}
