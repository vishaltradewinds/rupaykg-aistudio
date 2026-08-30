# RupayKg Enterprise 3.0 — Service Consolidation Audit

**Checkpoint:** `480b5b3f7543522138476651a40f03bd07c1934c`
**Branch:** `cleanup/service-consolidation-20260830`
**Date:** 2026-08-30

## Objective

Identify duplicate/legacy service implementations before deleting or quarantining code. The frozen checkpoint is preserved as the rollback boundary; this audit does not alter production behavior.

## Findings

### 1. Carbon calculation/MRV — DUPLICATED, HIGH PRIORITY

| Service | Role | Disposition |
|---|---|---|
| `src/services/carbonEngine.ts` | CQE 1.0 canonical calculation engine, methodology catalogue, three-ledger model | **CANONICAL** |
| `src/services/carbonOsService.ts` | Separate `CarbonCalculationEngine` + `MRVQualityEngine` using the same WA03 methodology family and database-backed calculation runs | **LEGACY / CONSOLIDATION TARGET** |
| `src/services/enterpriseMrvService.ts` | Large in-memory/localStorage enterprise MRV store and workflow engine | **LEGACY UI PATH / CONSOLIDATION TARGET** |

Evidence: `server.ts` imports the CQE implementation from `carbonEngine.ts`; the CQE UI calls the `/api/carbon/cqe/*` endpoints. `enterpriseMrvService.ts` is still directly consumed by `EnterpriseSuite.tsx`, so it must not be deleted until that UI is migrated to the canonical server-backed path.

### 2. Registry boundaries — DUPLICATED, HIGH PRIORITY

| Service | Role | Disposition |
|---|---|---|
| `src/services/authoritativeCreditRegistry.ts` | Typed authoritative registry boundary; fail-closed adapter interface | **CANONICAL BOUNDARY** |
| `src/services/cccRegistryService.ts` | Separate direct `CCC_REGISTRY_API_URL` + API-key mint endpoint | **LEGACY ADAPTER CANDIDATE** |
| `src/services/registryGatewayAdapter.ts` | Generic registry gateway abstraction used by legacy enterprise UI | **LEGACY / REVIEW** |

The canonical direction is to keep one authoritative-programme adapter boundary and have domain integrations depend on it. Do not delete `cccRegistryService.ts` until all call sites are migrated and CI proves no regression.

### 3. GCP commercial lifecycle — SEPARATED BY RESPONSIBILITY, NOT DUPLICATE

| Service | Role | Disposition |
|---|---|---|
| `gcpCommercialIntegration.ts` | End-to-end GCP custody/list/reserve/transfer/reconcile/settle/retire orchestration | **CANONICAL** |
| `gcpCommercialLifecycle.ts` | Pure state-transition rules | **KEEP** |
| `gcpCommercialLifecycleLedger.ts` | Persistent lifecycle/audit ledger | **KEEP** |
| `gcpSandboxContractAdapter.ts` | Sandbox/contract adapter boundary | **KEEP** |

These four services form one bounded adapter/lifecycle stack and should not be merged merely to reduce file count.

### 4. Environmental credit custody — LAYERED, NOT DUPLICATE

`environmentalCreditRepository.ts`, `environmentalCreditLifecycle.ts`, `creditDepositoryPolicy.ts`, and `creditDepositoryService.ts` have different repository/policy/application responsibilities. Keep them separated unless a later dependency graph proves a concrete duplicate implementation.

### 5. LGD — TWO LAYERS, KEEP

`lgdDb.ts` is the local authoritative-data store/synchronization layer; `lgdService.ts` is the application-facing adapter. Keep both.

## Immediate safe cleanup

`server.ts` contains imports for `CCCRegistryService` and `HederaAnchorProvider` with no other references in the file at this checkpoint. These are dead imports and can be removed without changing runtime behavior. The service files themselves remain untouched until repository-wide call-site verification is complete.

## Deletion rule

No service is deleted solely because its filename looks duplicated. A service may be removed only after:

1. repository-wide call-site verification,
2. canonical replacement is identified,
3. tests covering the old behavior pass against the replacement,
4. TypeScript/build passes,
5. complete regression passes,
6. the change is isolated in a reviewable commit/PR.

## Next consolidation sequence

1. Remove dead imports.
2. Build a call-site map for `enterpriseMrvService`, `carbonOsService`, `cccRegistryService`, and `registryGatewayAdapter`.
3. Migrate remaining legacy consumers to canonical boundaries.
4. Re-run full regression.
5. Only then quarantine/delete proven-unused implementations.
