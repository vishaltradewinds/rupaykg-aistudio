# RupayKg Live Database Authority Audit — 2026-11-07

## Scope

Read-only inspection of the Neon project currently named `rupaykg-production-fresh`.

Project ID: `steep-mud-79906940`

Primary/default branch: `main` (`br-restless-base-b44cip2h`)

Database: `rupaykg`

PostgreSQL: 18

This audit is evidence for the TRL 9 master gap register. It does not modify the database.

## Findings

### 1. One database exists on the inspected Neon project

The primary branch exposes one PostgreSQL database:

- `rupaykg`

The database owner is the `rupaykg` role.

This supports a **single-database topology within this Neon project**, but it does not by itself prove that every deployed application runtime uses this database. Deployment environment configuration must still be reconciled against the live runtime.

### 2. The inspected production branch contains 67 public tables

The live `rupaykg` database reports:

- 67 public base tables
- 67 information-schema public tables
- 0 public RLS policies

The schema contains the expected organization-scoped data model, including:

- `organizations`
- `organization_memberships`
- `organization_geography_scopes`
- `organization_statutory_profiles`
- `organization_verification_evidence`
- `carbon_projects`
- `measurements`
- `mrv_observations`
- `mrv_provenance_events`
- `evidence_artifact_series`
- `field_devices`
- `registry_events`
- `schema_migrations`

### 3. Tenant isolation is NOT currently enforced by PostgreSQL RLS

All 67 inspected public tables report:

- `rls_enabled = false`
- `rls_forced = false`

The database also reports:

- 0 PostgreSQL policies in `pg_policies`

This is a blocking finding for the multi-tenant TRL 9 assurance gate. Neon documentation confirms PostgreSQL RLS remains a supported database-level mechanism and specifically identifies RLS as a useful control for multi-tenant applications sharing a database. citeturn637140search0turn637140search9

### 4. The database owner role has RLS bypass capability

The inspected `rupaykg` role reports:

- `rolsuper = false`
- `rolcreaterole = true`
- `rolcreatedb = true`
- `rolcanlogin = true`
- `rolreplication = true`
- `rolbypassrls = true`

Therefore, even if RLS policies are introduced, the production application must not run ordinary tenant-scoped application traffic through a role that bypasses RLS.

Neon documents database-level RLS as an authorization boundary and recommends RLS for important core authorization logic in multi-tenant applications. citeturn637140search1turn637140search9

### 5. Migration ledger currently reports 92 migrations

`public.schema_migrations` reports:

- 92 applied migrations
- first version: `001`
- last version: `20261021`
- first applied: 2026-10-17T10:47:58.762Z
- last applied: 2026-10-27T13:46:14.262Z

This is consistent with the previously identified 92-migration production state, but repository-to-database migration parity has **not yet been proven** in this audit.

### 6. Multiple Neon rehearsal branches exist

The project currently contains multiple non-primary branches, including:

- `rupaykg-role-split-rehearsal-20261106`
- `shakti-unresolved-migration-rehearsal-20261028`
- `verification-authz-rehearsal-2026-11-03`
- `rupaykg-rls-assurance-lab-20261101`
- `rupaykg-tenant-isolation-lab-20261101`
- `shakti-prod-main-worker-migration-rehearsal-20261031`
- `shakti-prod-main-rehearsal-20261031`

These are useful engineering evidence environments, but they are not the production authority. The primary/default branch is the inspected production candidate.

## Gate disposition

| Gate | Result |
|---|---|
| One Neon project identified | PASS — project `rupaykg-production-fresh` |
| One database on primary branch | PASS — `rupaykg` |
| Migration ledger present | PASS — 92 rows |
| Repository ↔ DB migration parity | OPEN |
| Runtime points to this DB | OPEN |
| PostgreSQL RLS enabled | **FAIL / BLOCKING** |
| PostgreSQL RLS policies present | **FAIL / BLOCKING** |
| Tenant-scoped application role | OPEN |
| Owner role bypass eliminated from app traffic | OPEN |
| Cross-tenant isolation test | OPEN |
| Production DB baseline frozen | OPEN |

## Required remediation sequence

1. Freeze the inspected primary database as the candidate authoritative DB.
2. Reconcile the repository migration set against the 92 applied database migrations.
3. Identify every tenant-bearing table and classify its access model.
4. Implement PostgreSQL RLS policies for tenant-scoped tables.
5. Establish a non-bypass application role with least privilege.
6. Keep privileged migration/administrative access separate from application traffic.
7. Add automated cross-tenant isolation tests for SELECT/INSERT/UPDATE/DELETE.
8. Verify the deployed runtime connection target and credentials.
9. Re-run the same read-only database audit and preserve the result as release evidence.
10. Only then close G-002.

## Safety boundary

No production database mutation was performed during this audit. RLS enablement, policy creation, role changes, privilege changes and migration application are intentionally left as controlled changes requiring a reviewed migration path and explicit approval before execution.

## Current conclusion

**G-002 remains OPEN and BLOCKING.**

The authoritative database candidate is now concretely identified, but the production tenant-isolation control is not yet demonstrated. The platform therefore remains **advanced engineering / pre-TRL-9 assurance**.
