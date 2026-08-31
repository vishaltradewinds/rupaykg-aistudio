/**
 * QUARANTINED LEGACY REGISTRY GATEWAY.
 *
 * The former implementation was a browser-local sandbox that could create
 * synthetic CCTS issuance records. It is intentionally unavailable from the
 * production service path.
 *
 * Canonical production registry boundary:
 *   ./authoritativeRegistryAdapter.ts
 */
export const REGISTRY_GATEWAY_QUARANTINED = true;

export function assertRegistryGatewayQuarantined(): never {
  throw new Error(
    'RegistryGatewayAdapter is quarantined. Use AuthoritativeRegistryAdapter for production registry operations.'
  );
}
