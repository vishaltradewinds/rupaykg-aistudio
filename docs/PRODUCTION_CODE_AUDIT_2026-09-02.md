# RupayKg Production Code Audit — 2026-09-02

## Scope

This audit uses `vishaltradewinds/rupaykg-aistudio` `main` as the sole source of truth. It covers the production architecture visible in the repository: authentication, PostgreSQL persistence, migrations/readiness, Redis, JWT/Firebase authentication, Hedera provenance, authoritative registry boundaries, environmental-credit custody, frontend/API contracts, security posture, and CI.

## Executive result

**Current production status: NOT READY.**

The observed login failure is a backend availability failure, not a bad-password failure. The frontend receives HTTP 503 and displays a misleading `Invalid Login ID or Password` message. The public impact endpoint also returns HTTP 500, consistent with the same database dependency problem.

The application is intentionally PostgreSQL-authoritative for users and operational data. Therefore the correct fix is to provide and migrate the production PostgreSQL database, not to bypass the database with an in-memory admin account.

## P0 / release-blocking findings

### 1. Production PostgreSQL is a hard dependency

`src/db/index.ts` creates a PostgreSQL pool and previously fell back to localhost-style defaults when no database configuration was supplied. That behavior is unsafe for Cloud Run/AI Studio because it can produce a healthy-looking process that cannot reach the authoritative database.

**Remediation applied:** production now requires `DATABASE_URL` or the complete `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, and `SQL_DB_NAME` configuration. The migration runner was also aligned to support the same connection model and production TLS settings.

### 2. Database schema verification was too weak

Startup verification previously checked for a list of tables but only warned on failure, while readiness checked only whether the `users` table could be queried.

**Remediation applied:** verification now fails its verification routine when any core table is missing and additionally checks the authentication columns `uid`, `email`, `password_hash`, and `role`.

### 3. Production migration configuration was inconsistent with runtime configuration

The migration runner required `SQL_*` variables, forced `ssl: false`, and therefore could diverge from the runtime database configuration.

**Remediation applied:** migrations now use `DATABASE_URL` when supplied, otherwise explicit SQL variables, and use the same production TLS rules as the runtime pool.

### 4. Admin authentication must remain DB-authoritative

The admin login path now uses `ensureAdminUser()` to self-heal the `admin_1` row from `ADMIN_PASSWORD` when the database is reachable. This is correct architecturally, but it necessarily fails when PostgreSQL is unavailable.

**Do not reintroduce an in-memory admin bypass.**

## P1 security / integrity findings

### 5. Authoritative registry transfer/retirement fail-closed boundary requires further remediation

`src/services/authoritativeRegistryAdapter.ts` correctly rejects unconfigured registry issuance verification, but its transfer and retirement paths currently return successful-looking local references when the external authoritative registry is not configured. This conflicts with the repository's own stated fail-closed issuer boundary.

**Required remediation before real statutory-credit operations:** unconfigured transfer and retirement must return `NOT_CONFIGURED` / failure, never a synthetic authoritative-looking reference or success state.

### 6. Frontend contains simulated operational states

`src/components/HederaGuardianSuite.tsx` initializes its UI with values such as operational status, latency, TPS, anchored-message counts, sequence numbers, and a 100% integrity score before a live API response is received. This can visually imply live infrastructure that has not been verified.

**Required remediation:** initial state must be `UNKNOWN` / `NOT_CONFIGURED` and live values must only be rendered after successful server responses. Any demonstration/simulation must be explicitly labeled as simulation.

### 7. Registration has a weak fallback password

`src/App.tsx` contains a fallback registration password of `password123` when no password is supplied.

**Required remediation:** remove the fallback and require an explicit password meeting the server's password policy. No production account should ever be created with a known default password.

### 8. VC issuer identity and trust model need tightening

`src/services/credentialService.ts` signs credentials with the configured server private key, but parts of the credential generation path use hardcoded issuer identifiers, while verification primarily relies on a single configured public key. The issuer identity and key must be cryptographically and semantically bound to the configured trust root.

**Required remediation:** use one configured issuer DID consistently and reject credentials whose issuer does not match the trusted issuer/key configuration.

## P2 findings

### 9. Redis is optional for the current blacklist implementation

`src/lib/redis.ts` falls back to an in-memory blacklist when `REDIS_URL` is absent. Authenticated requests fail closed when a configured Redis service is unavailable. This is acceptable for a single-process development environment but is not durable revocation across multiple production instances.

**Production requirement:** configure managed Redis for multi-instance deployments and treat it as required if cross-instance token revocation is part of the security model.

### 10. Security middleware is present but needs production verification

Helmet, CORS, request sanitization, rate limiting, RS256 verification, bcrypt password verification, and server-side RBAC are present. The final production gate must verify the exact deployed configuration rather than relying only on source-level claims.

### 11. External statutory integrations are intentionally fail-closed in several areas

The code correctly distinguishes RupayKg's provenance/evidence role from authoritative BEE/GCP issuance. However, the real registry endpoints and credentials are deployment dependencies and cannot be fabricated by application code.

## Current deployment blocker

The code cannot make the published AI Studio application operational without a reachable PostgreSQL database containing the required migrated schema. The repository's runtime is deliberately DB-authoritative.

Required production configuration includes:

- `DATABASE_URL` **or** complete SQL connection variables
- production TLS/CA configuration as required by the database provider
- `ADMIN_PASSWORD` with at least 16 characters
- RS256 JWT key pair
- required VC issuer keys if VC issuance is enabled
- Hedera secrets if real HCS writes are enabled
- Redis if durable multi-instance revocation is required
- authoritative registry credentials/endpoints before statutory-credit custody mutations are enabled

## CI status

The repository's `RupayKg Production Audit` workflow is configured to exercise an empty-user authentication bootstrap, migrations, build, domain tests, P0/P1/P2 security suites, and production certification. A new run was triggered by the latest database configuration remediation and was observed in progress during this audit.

## Acceptance gate

The application should not be called production-ready until all of the following are true:

1. `/api/readiness` returns `READY` against the real production PostgreSQL instance.
2. All required migration tables exist.
3. `POST /api/login` with the configured admin password returns 200 and `admin_1 / super_admin`.
4. Wrong credentials return 401, while database outage returns a service-availability error rather than a credential error.
5. `/api/public/impact` returns a valid response without a database error.
6. Authenticated routes can load their authoritative PostgreSQL user record.
7. Redis behavior matches the intended multi-instance revocation model.
8. No known default passwords or private keys exist in frontend/source artifacts.
9. Hedera UI displays only verified live status; simulations are clearly labeled.
10. Authoritative registry transfer/retirement operations fail closed when statutory registry confirmation is unavailable.
11. VC issuer DID and signing key trust are consistent and verified.
12. CI production audit and certification suites are green.

## Important limitation

Source review can establish code defects and configuration requirements, but it cannot provision Cloud Run networking, Cloud SQL, Secret Manager bindings, or external statutory registry credentials. Those deployment dependencies must be configured in the hosting environment.
