/**
 * CCTS authoritative issuance -> RupayKg custody admission.
 *
 * The ICM/BEE record is authoritative. This module only admits an already
 * authoritative issuance into RupayKg's depository ledger; it never mints,
 * transfers, or retires a CCC on behalf of the ICM Registry.
 */

import {
  assertAuthoritativeCctsIssuance,
  type CctsAuthoritativeIssuance,
} from "./cctsAuthoritativeIssuanceGate";

export type CustodyAdmissionRecord = CctsAuthoritativeIssuance & {
  custodyStatus: "CUSTODY_ACTIVE";
  source: "BEE_ICM";
  admittedAt: string;
};

export function admitAuthoritativeCctsToCustody(
  issuance: CctsAuthoritativeIssuance,
  now = new Date().toISOString()
): CustodyAdmissionRecord {
  assertAuthoritativeCctsIssuance(issuance);

  if (!Number.isFinite(Date.parse(now))) {
    throw new Error("CCTS_CUSTODY_ADMITTED_AT_INVALID");
  }

  return {
    ...issuance,
    custodyStatus: "CUSTODY_ACTIVE",
    source: "BEE_ICM",
    admittedAt: now,
  };
}

/**
 * Idempotency key for custody admission. The authoritative issuance reference
 * and serial identify the external asset; RupayKg must never create a second
 * custody position for the same authoritative issuance.
 */
export function custodyAdmissionKey(issuance: CctsAuthoritativeIssuance): string {
  assertAuthoritativeCctsIssuance(issuance);
  return `BEE_ICM:${issuance.issuanceReference}:${issuance.serialNumber}`;
}
