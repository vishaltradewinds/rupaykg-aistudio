# RupayKg DB Authority + Runtime Role Target — 2026-11-07

## Target architecture

Separate database responsibilities into three explicitly controlled identities:

### 1. Migration authority
Used only by deployment/migration jobs. DDL-capable. Never used by request-serving application traffic.

### 2. Application runtime
Dedicated least-privilege PostgreSQL role with `NOBYPASSRLS`. No DDL. Only required DML/EXECUTE access. Tenant access is constrained by RLS plus application authorization.

### 3. Operational/admin authority
Restricted human/service administration role, separately audited and not embedded in application runtime configuration.

## Current state

Production currently has no observed dedicated `ai_studio_app_user` LOGIN role and all observed LOGIN roles have `BYPASSRLS`. Therefore the target state is not yet deployed.

## Migration-authority rule

The repository migration runner now fails closed when `public.schema_migrations` exists but `drizzle.__drizzle_migrations` does not. This prevents the runner from silently creating a second migration ledger.

## Rollout gate

The runtime-role transition must be rehearsed against a production-derived Neon branch. Production changes require:

- role creation/privilege review;
- connection test using the exact runtime role;
- `NOBYPASSRLS` verification;
- schema/table/sequence/function grants review;
- cross-tenant isolation tests;
- application regression suite;
- rollback path;
- deployment acceptance evidence.

No production role mutation is authorized merely because the target architecture is documented.
