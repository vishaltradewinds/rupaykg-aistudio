/**
 * QUARANTINED LEGACY REGISTRY GATEWAY.
 *
 * The former implementation was a browser-local sandbox that could create
 * synthetic CCTS issuance records. It is intentionally unavailable for
 * production registry operations.
 *
 * Canonical production registry boundary:
 *   ./authoritativeRegistryAdapter.ts
 *
 * The compatibility surface below exists only so legacy UI compilation does
 * not silently resurrect the old implementation. Every mutating operation
 * fails closed. No localStorage persistence, issuance, transaction hash, or
 * external registry write is performed here.
 */

export const REGISTRY_GATEWAY_QUARANTINED = true;

export function assertRegistryGatewayQuarantined(): never {
  throw new Error(
    'RegistryGatewayAdapter is quarantined. Use AuthoritativeRegistryAdapter for production registry operations.'
  );
}

/** @deprecated Compile-only quarantine facade. Do not use for registry state. */
export class RegistryGatewayAdapter {
  private static quarantinedError(): never {
    return assertRegistryGatewayQuarantined();
  }

  static getProjectSubmissions(_projectId?: string): never {
    return this.quarantinedError();
  }

  static submitToCCTS(_assessment: unknown, _totalCredits: number): never {
    return this.quarantinedError();
  }

  static approveAndIssueCredits(_submissionId: string): never {
    return this.quarantinedError();
  }
}
