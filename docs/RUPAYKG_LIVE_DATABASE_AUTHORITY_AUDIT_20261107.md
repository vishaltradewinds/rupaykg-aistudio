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

### 5. Repository ↔ production migration authority is materially divergent

The production database reports:

- `public.schema_migrations`: 92 applied migrations
- first version: `001`
- last version: `20261021`
- first applied: 2026-10-17T10:47:58.762Z
- last applied: 2026-10-27T13:46:14.262Z

The current `main` repository reports a different migration system:

- `drizzle/meta/_journal.json`: **2** migration entries
- migration tags: `0000_sloppy_misty_knight`, `0001_environmental_credit_depository`
- `drizzle.__drizzle_migrations`: **does not exist** on the inspected production database
- `public.schema_migrations`: **does exist** on the inspected production database

Therefore repository-to-production migration parity is not merely unproven; the inspected artifacts show a **migration-authority mismatch**. The repository's current formal Drizzle migration ledger cannot be used to explain the 92-migration production schema. This is a blocking release-baseline finding.

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
| Production migration ledger present | PASS — 92 rows in `public.schema_migrations` |
| Repository migration ledger parity | **FAIL / BLOCKING** — repo journal has 2 entries while production has 92; Drizzle ledger absent |
| Runtime points to this DB | OPEN |
| PostgreSQL RLS enabled | **FAIL / BLOCKING** |
| PostgreSQL RLS policies present | **FAIL / BLOCKING** |
| Tenant-scoped application role | OPEN |
| Owner role bypass eliminated from app traffic | OPEN |
| Cross-tenant isolation test | OPEN |
| Production DB baseline frozen | OPEN |

## Required remediation sequence

1. Freeze the inspected primary database as the candidate authoritative DB.
2. Freeze the 92-row production migration ledger as evidence; reconstruct/reconcile the full authoritative migration history before any new migration is applied.
3. Determine whether `public.schema_migrations` or the Drizzle journal is the intended canonical migration authority; select exactly one and retire the other path.
4. Reconcile the repository migration set against the 92 applied database migrations.
5. Identify every tenant-bearing table and classify its access model.
6. Implement PostgreSQL RLS policies for tenant-scoped tables.
7. Establish a non-bypass application role with least privilege.
8. Keep privileged migration/administrative access separate from application traffic.
9. Add automated cross-tenant isolation tests for SELECT/INSERT/UPDATE/DELETE.
10. Verify the deployed runtime connection target and credentials.
11. Re-run the same read-only database audit and preserve the result as release evidence.
12. Only then close G-002.

## Safety boundary

No production database mutation was performed during this audit. RLS enablement, policy creation, role changes, privilege changes and migration application are intentionally left as controlled changes requiring a reviewed migration path and explicit approval before execution.

## Current conclusion

**G-002 remains OPEN and BLOCKING.**

The authoritative database candidate is now concretely identified, but the production tenant-isolation control is not yet demonstrated. The platform therefore remains **advanced engineering / pre-TRL-9 assurance**.


## Additional application architecture finding

The current `main` repository contains `src/db/index.ts` using `DATABASE_URL` or fallback SQL environment variables, while `scripts/migrate.ts` executes a Drizzle journal from `./drizzle/meta/_journal.json`. The live production database instead exposes `public.schema_migrations` and no `drizzle.__drizzle_migrations` ledger. This creates a release-process risk: application schema, migration authority, and production database history are not presently demonstrated to be one coherent lifecycle.