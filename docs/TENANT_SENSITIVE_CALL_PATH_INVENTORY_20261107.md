# RupayKg Tenant-Sensitive Call-Path Inventory — 2026-11-07

## Purpose

This inventory is the execution baseline for converting legacy global-DB call paths to the authoritative organization/identity authorization model.

This is an engineering evidence document. It does **not** claim tenant isolation is complete.

## Authoritative boundary

Authenticated subject -> `public.identities.external_subject` -> active `public.organization_memberships` -> active `public.organizations`.

Legacy `users.organization_name` and legacy `ownerId = authenticated uid` are not accepted as the authoritative tenant boundary.

## Confirmed high-risk call paths

| Area | File | Current pattern | Risk | Required target |
|---|---|---|---|---|
| Carbon projects | `src/routes/carbon.ts` | Global `db.select/insert`; `ownerId` filtering | Cross-tenant read/write risk | Resolve authoritative tenant; query by live `organization_id`; transaction-local RLS context |
| Carbon project detail | `src/routes/carbon.ts` | Fetch by project ID then manual `ownerId` check | TOCTOU / legacy identity boundary | Tenant-scoped query before returning/mutating |
| Carbon intake | `src/routes/carbon.ts` | Project fetch + legacy owner check; service uses global DB | Service bypass can defeat route check | Tenant-aware service transaction |
| Carbon intake read | `src/routes/carbon.ts` | Global query by project ID | Cross-tenant disclosure | Tenant-scoped project/intake relationship |
| CCTS submission | `src/routes/carbon.ts` | Service called directly with project ID | No proven tenant context in service | Tenant-aware service boundary |
| Monitoring report | `src/routes/carbon.ts` | Service called directly with project ID | No proven tenant context | Tenant-aware service boundary |
| Audit package | `src/routes/carbon.ts` | Service called directly with project ID | No proven tenant context | Tenant-aware service boundary |
| Pilot issues | `src/routes/carbon.ts` | Service called directly with project ID | Project ownership not proven in service | Tenant-aware project lookup + transaction |
| Records | `src/services/recordService.ts` | Global table access; userId is legacy identity | No authoritative org scope | Map record -> authoritative organization/identity/project scope |
| Carbon events | `src/services/carbonEventService.ts` | Global table access | Event lineage may cross tenant boundary | Explicit owner/project/org scope |
| Compliance | `src/services/complianceService.ts` | Global table access; entityId/metadata filtering | Global reads and metadata-based scope | Authoritative organization/entity relationship |
| Pilot onboarding | `src/services/pilotService.ts` | Global reads/writes | Pilot data not tenant-scoped | Explicit organization/project scope |
| Pilot records | `src/services/pilotService.ts` | Global reads/writes by pilotId | Indirect scope only | Resolve pilot -> organization before access |

## Additional confirmed architectural issue

`src/db/index.ts` exposes a global Drizzle DB object and all legacy services import it directly. This is acceptable for platform-global operations only; tenant-sensitive operations must use a controlled transaction boundary.

## Required conversion order

1. Reconcile live schema vs repository ORM schema before changing tenant-sensitive queries.
2. Establish the authoritative project/workspace organization relationship in the ORM.
3. Convert carbon project CRUD first.
4. Convert project child resources (intake, eligibility, submissions, monitoring, audit package).
5. Convert pilot/project issue paths.
6. Convert records/events/compliance/pilot services.
7. Add two-organization A/B integration tests against the non-production RLS rehearsal.
8. Only after rehearsal evidence passes, consider production RLS enablement.

## Explicit non-actions

- No production RLS enabled.
- No production role mutation.
- No production migration executed.
- No legacy `ownerId` or `organization_name` field has been declared authoritative.
- No cross-organization tables have been placed under generic RLS without bilateral authorization semantics.

## Exit criterion

G-002 remains BLOCKING until:
- migration authority is reconciled;
- runtime DB identity is proven and is NOBYPASSRLS;
- ORM/live-schema scope mismatch is resolved;
- tenant-sensitive call paths are converted;
- two-org A/B isolation passes in rehearsal;
- production deployment evidence confirms the same authorization model.
