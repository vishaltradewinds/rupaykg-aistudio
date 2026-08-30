/**
 * End-to-end CCTS verification admission gate.
 *
 * This module joins the approved methodology registry, methodology-specific
 * MRV evidence requirements, and ACVA sector eligibility into one fail-closed
 * decision. It does not issue CCCs and does not mark an external verification
 * as complete. BEE/ICM remains authoritative for issuance.
 */

import {
  assertCctsVerificationEligibility,
  isBEEApprovedCctsMethodology,
} from "./cctsOfficialRegistry";
import { assertCctsMrvEvidenceComplete } from "./cctsMethodologyEvidence";

export type RupayKgOperatingContext = "urban" | "rural";

export type CctsVerificationAdmission = {
  projectId: string;
  operatingContext: RupayKgOperatingContext;
  methodologyCode: string;
  acvaId: string;
  acvaOffsetSectors: readonly string[];
  evidenceIds: readonly string[];
};

/**
 * Performs every local prerequisite that must succeed before a project can be
 * submitted to an ACVA verification workflow.
 *
 * A successful result means ONLY "eligible to enter verification". It never
 * means "verified" or "issued".
 */
export function assertReadyForAcvaVerification(
  input: CctsVerificationAdmission
): void {
  if (!input.projectId.trim()) {
    throw new Error("CCTS_PROJECT_ID_REQUIRED");
  }

  if (!input.acvaId.trim()) {
    throw new Error("CCTS_ACVA_ID_REQUIRED");
  }

  if (input.operatingContext !== "urban" && input.operatingContext !== "rural") {
    throw new Error(`CCTS_OPERATING_CONTEXT_INVALID:${input.operatingContext}`);
  }

  if (!isBEEApprovedCctsMethodology(input.methodologyCode)) {
    throw new Error(`CCTS_METHODOLOGY_NOT_APPROVED:${input.methodologyCode}`);
  }

  assertCctsMrvEvidenceComplete({
    methodologyCode: input.methodologyCode,
    evidenceIds: input.evidenceIds,
  });

  assertCctsVerificationEligibility({
    methodologyCode: input.methodologyCode,
    acvaOffsetSectors: input.acvaOffsetSectors,
  });
}

export function buildAcvaVerificationAdmission(input: CctsVerificationAdmission) {
  assertReadyForAcvaVerification(input);

  return {
    projectId: input.projectId,
    operatingContext: input.operatingContext,
    methodologyCode: input.methodologyCode,
    acvaId: input.acvaId,
    status: "READY_FOR_ACVA_VERIFICATION" as const,
    authoritativeIssuer: "BEE_ICM" as const,
    issuanceStatus: "NOT_ISSUED" as const,
  };
}
