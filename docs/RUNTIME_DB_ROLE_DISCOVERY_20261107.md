# RupayKg Runtime DB Role Discovery — 2026-11-07

## Evidence from canonical branch

`src/db/index.ts` creates the application PostgreSQL pool from `DATABASE_URL`, or from `SQL_HOST` + `SQL_USER` + `SQL_PASSWORD` + `SQL_DB_NAME`. Therefore the repository does not hard-code the runtime database username; deployment configuration determines the actual role.

`src/db/ensureSchema.ts` explicitly states that the runtime application user is intended to be `ai_studio_app_user` and that it does not have DDL privileges. This is application-side intent, not proof that production currently uses that role.

## Live production evidence

The production Neon database currently exposes these LOGIN roles:

- `cloud_admin` — SUPERUSER, BYPASSRLS
- `neon_service` — BYPASSRLS
- `rupaykg` — BYPASSRLS

No `ai_studio_app_user` LOGIN role was observed in the live role inventory.

## Rehearsal evidence

The existing production-derived `rupaykg-role-split-rehearsal-20261106` branch contains a technically valid role split:

- `rupaykg` — administrative/BYPASSRLS legacy role
- `rupaykg_runtime_model_20261106` — LOGIN, NOBYPASSRLS, non-administrative
- `rupaykg_owner_model_20261106` — NOLOGIN, NOBYPASSRLS ownership role

The runtime-model role already has explicit table ACLs with a mixed read/write/read-only matrix. This proves the role architecture can be rehearsed without giving the application BYPASSRLS.

## Determination

The actual deployed runtime identity remains **unproven** because repository source does not contain the deployment secret/configuration. The production role inventory is insufficient to infer which role the deployed service uses.

## Required production-safe action

1. Inspect deployed service configuration/connection telemetry without revealing credentials.
2. Record only the non-secret DB username/role and deployment target.
3. If production uses `rupaykg` or another BYPASSRLS role, transition to a dedicated NOBYPASSRLS runtime role after rehearsal.
4. Keep migration/admin credentials separate from runtime credentials.
5. Verify effective privileges using the exact runtime identity.
6. Complete RLS policy and cross-organization testing before production activation.

## Gate

G-002 remains BLOCKING until runtime identity, least-privilege grants, migration authority, and tenant isolation are evidenced. No production role mutation has been performed.
