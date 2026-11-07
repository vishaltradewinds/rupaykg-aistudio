# RupayKg Runtime DB Role Discovery — 2026-11-07

## Evidence from canonical branch

`src/db/index.ts` creates the application PostgreSQL pool from `DATABASE_URL`, or from `SQL_HOST` + `SQL_USER` + `SQL_PASSWORD` + `SQL_DB_NAME`. Therefore the repository does not hard-code the runtime database username; deployment configuration determines the actual role.

`src/db/ensureSchema.ts` explicitly states that the runtime application user is intended to be `ai_studio_app_user` and that it does not have DDL privileges. This is an application-side intent, not proof that production currently uses that role.

## Live production evidence

The production Neon database currently exposes these LOGIN roles:

- `cloud_admin` — SUPERUSER, BYPASSRLS
- `neon_service` — BYPASSRLS
- `rupaykg` — BYPASSRLS

No `ai_studio_app_user` LOGIN role was observed in the live role inventory.

## Determination

The runtime identity is **not yet proven**. The repository's intended runtime role and the live role inventory do not match. Because credentials are not stored in the repository and should not be exposed, runtime identity must be verified from deployment environment configuration/connection telemetry rather than guessed.

## Required production-safe action

1. Inspect the deployed service's configured database connection identity without revealing the secret.
2. Record only the non-secret DB username/role and deployment target.
3. If production uses `rupaykg`, replace that broad role with a dedicated `NOBYPASSRLS` runtime role after rehearsal.
4. Keep migration/admin credentials separate from application runtime credentials.
5. Verify effective privileges with a connection using the exact runtime role before enabling RLS.

## Gate

G-002 remains BLOCKING until runtime identity and least-privilege posture are evidenced. No production role mutation has been performed.
