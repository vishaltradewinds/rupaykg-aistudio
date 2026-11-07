# RupayKg Live Schema Baseline Hash — 2026-11-07

## Canonical metadata fingerprint

Production Neon database: `rupaykg-production-fresh` / `steep-mud-79906940` / branch `main` / database `rupaykg`.

A deterministic metadata fingerprint was calculated from 2,077 ordered metadata records covering public-schema columns, constraints, indexes, routines, triggers, public enums and extensions.

**SHA-256:** `fee94d42fd0a23fafe80236604084b0a07b0ad3721a66de6c4cae6dbcf227051`

This is a structural metadata fingerprint, not a full physical database dump. It is therefore suitable as a baseline integrity marker but is not by itself sufficient to prove row-level data parity or migration-history parity.

## Current security state captured with the baseline

- Public base tables: 67
- Explicit `organization_id` tables: 23
- Public RLS policies: 0
- Inspected public tables: RLS disabled and not forced
- Production migration ledger: 92 rows in `public.schema_migrations`
- `drizzle.__drizzle_migrations`: absent

## Shakti interpretation

The fingerprint establishes a reproducible point-in-time structural reference. Future schema changes must produce an intentional new fingerprint and a corresponding migration/evidence record. It must never be used to overwrite or reinterpret the historical `public.schema_migrations` ledger.
