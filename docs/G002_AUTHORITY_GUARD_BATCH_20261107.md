# G-002 Authority Guard Batch — 2026-11-07

## Completed

This batch establishes three fail-closed, non-mutating repository controls:

1. `scripts/migrationAuthorityGuard.ts`
   - detects the live custom migration ledger versus Drizzle ledger;
   - blocks migration-authority ambiguity;
   - never creates or rewrites production migration history.

2. `scripts/liveSchemaAuthorityGuard.ts`
   - deterministically fingerprints public-schema structural metadata;
   - compares the live database against an explicitly supplied `LIVE_SCHEMA_BASELINE_HASH`;
   - blocks on unexpected structural drift.

3. `scripts/runtimeDbRoleGuard.ts`
   - resolves the connected PostgreSQL role;
   - blocks SUPERUSER, CREATEROLE, CREATEDB, replication-enabled or BYPASSRLS runtime identities.

Package scripts now expose all three guards.

## Baseline

The recorded live structural fingerprint is:

`fee94d42fd0a23fafe80236604084b0a07b0ad3721a66de6c4cae6dbcf227051`

The fingerprint covers 2,077 ordered metadata records from the public schema. It is a structural baseline, not a row-level backup.

## Important limitation

These controls are repository-side gates. They do **not** prove that the currently deployed Cloud Run/Vercel runtime actually uses the dedicated NOBYPASSRLS identity, because that runtime connection has not yet been independently observed.

## Current G-002 status

**BLOCKING / FAIL / OPEN**

Next required evidence is execution of the runtime guard using the actual deployed runtime connection and successful two-organization A/B isolation using that same NOBYPASSRLS identity. No production role mutation is authorized before rehearsal and rollback evidence.
