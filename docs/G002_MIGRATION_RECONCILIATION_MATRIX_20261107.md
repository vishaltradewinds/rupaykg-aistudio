# Migration Authority Reconciliation Matrix — 2026-11-07

## Decision

The live Neon production database is the authoritative runtime database for RupayKg. Its migration ledger is currently `public.schema_migrations` with 92 rows. The repository Drizzle journal contains only 2 entries.

This is a **blocking reconciliation condition**. Production migration history must not be fabricated, reset, or replaced with a synthetic Drizzle ledger.

## Evidence

| Item | Live production | Repository | Gate |
|---|---|---|---|
| Database | Neon project `rupaykg-production-fresh`, primary branch `main`, DB `rupaykg` | — | Confirmed |
| Public tables | 67 | ORM/schema requires reconciliation | Open |
| Custom migration ledger | `public.schema_migrations`, 92 rows | — | Confirmed |
| Drizzle ledger | Absent | Drizzle runner expects `drizzle.__drizzle_migrations` | Blocking |
| Drizzle journal | — | 2 entries | Blocking mismatch |
| Latest live migration ledger row | version `096`, filename `096_verification_authorization_provenance.sql` | Exact filename not recovered by repository search | Open |
| Production mutation | Not performed | — | Required safeguard |

## Required reconciliation sequence

1. Preserve the live `public.schema_migrations` ledger as evidence.
2. Inventory every recoverable migration SQL file and historical branch lineage.
3. Do not invent missing migration files or hashes.
4. Establish a controlled live-schema baseline/snapshot that represents the actual production schema.
5. Define the canonical migration authority explicitly.
6. Make CI compare the repository migration authority against the controlled baseline.
7. Rehearse migration execution on a non-production branch cloned from the live schema.
8. Verify rollback/recovery behavior.
9. Only after parity is demonstrated, consider any production migration-authority transition.
10. Keep production certification blocked until this gate and dependent tenant-isolation/runtime gates are closed.

## Guard implementation

`scripts/migrationAuthorityGuard.ts` now fails closed when:

- `public.schema_migrations` exists without `drizzle.__drizzle_migrations`;
- the custom production ledger exists but `MIGRATION_AUTHORITY_RECONCILED=true` has not been explicitly established;
- neither recognized migration ledger exists;
- a Drizzle ledger exists while the repository journal is empty.

The guard is observational only; it does not mutate production schema or migration history.

## Current gate status

**G-002 Database authority: BLOCKING / FAIL / OPEN**

The next valid engineering step is controlled schema/migration parity and non-production rehearsal. Production migration history must remain untouched until that evidence exists.
