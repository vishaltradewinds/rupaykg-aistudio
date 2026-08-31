# Registry Consolidation Notes

Baseline: `28b50fdd709c041088aa9b5a1a21128f2bdb0e04`

## Finding

`CCCRegistryService` is retained in `src/services/cccRegistryService.ts`, but its only repository-level reference in `server.ts` is an unused import. The service duplicates the authoritative registry boundary while calling `/mint-ccc` directly.

`AuthoritativeRegistryAdapter` is the canonical registry boundary and explicitly enforces issuer boundaries and fail-closed behavior.

## Decision

Remove the orphan `CCCRegistryService` and its unused server import in a dedicated cleanup change. Do not alter `AuthoritativeRegistryAdapter` or introduce live registry credentials.

## Verification requirement

Run the complete Production Audit on this cleanup branch before merging. If any test or runtime reference appears, restore the service and reassess rather than weakening the gate.
