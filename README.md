# RupayKg Enterprise 3.0

**RupayKg** is a circular-economy and environmental MRV (Measurement, Reporting and Verification) operating platform for recording real-world waste and biomass activity, compliance evidence, carbon/CCC workflows, and stakeholder operations.

The current production architecture is a **single full-stack TypeScript application** with a React/Vite frontend, Express backend, PostgreSQL persistence, Redis-backed session revocation, and fail-closed integrations for Hedera HCS and W3C Verifiable Credentials.

## Current architecture

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Maps:** Leaflet / React Leaflet with OpenStreetMap tiles
- **Charts:** Recharts
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **Authentication:** RS256 JWT verification with PostgreSQL-authoritative user/RBAC resolution
- **Session revocation:** Redis JWT `jti` blocklist; authentication fails closed when the revocation service is unavailable
- **Trust rail:** Hedera Consensus Service through the canonical `src/services/hederaAnchor.ts` provider
- **Verifiable Credentials:** W3C-compatible asymmetric signing through the canonical credential service
- **PWA/offline:** VitePWA plus application-level IndexedDB offline mutation queue
- **Localization:** i18next with Indian-language translations
- **Deployment:** Google Cloud Run / single Node.js production bundle

## Security posture

Production integrations are deliberately **fail closed**. The application does not fabricate Hedera transactions, VC signatures, weighbridge evidence, or Guardian mutations when required external credentials/providers are unavailable.

Private keys and environment secrets must never be committed to Git. PEM files are excluded through `.gitignore`. Production secrets belong in the deployment secret-management system.

## Canonical production commands

```bash
npm install
npm run dev
npm run build
npm start
```

The production build generates the Vite frontend and bundles the Express server to:

```text
dist/server.cjs
```

## Verification

The repository contains security, regression, adversarial, certification, and persistence-survival test suites. Before production acceptance, run the complete available suite and verify the production build succeeds.

Typical commands:

```bash
npm test
npm run test:p0
npm run test:p1
npm run test:p2
npm run test:cert
npm run build
```

## Production integrations

### Hedera HCS

Real HCS writes require production deployment secrets including:

- `HEDERA_NETWORK`
- `HEDERA_TOPIC_ID`
- `HEDERA_OPERATOR_ID`
- `HEDERA_OPERATOR_KEY`

Without these, write operations must remain unavailable rather than generating synthetic evidence.

### W3C Verifiable Credentials

Real asymmetric issuance requires:

- `VC_ISSUER_DID`
- `VC_ISSUER_PRIVATE_KEY`
- `VC_ISSUER_PUBLIC_KEY`

API callers cannot supply signing keys. The server-side credential boundary owns signing and verification configuration.

### Redis

JWT revocation requires:

- `REDIS_URL`

If Redis is unavailable, protected authentication paths fail closed by design.

### Weighbridge

Physical weighbridge integration requires the configured field hardware/interface and is an external acceptance gate; it is not simulated in production mode.

## Main platform domains

The application includes operational and governance workflows covering areas such as:

- Urban ULB solid-waste-management operations
- Rural / Gram Panchayat operations
- MRV and CCTS carbon workflows
- Hedera / Guardian trust and evidence workflows
- LGD (Local Government Directory) data
- ESG and stakeholder reporting
- Field evidence, GPS and offline workflows
- Stakeholder onboarding and verification

## Repository structure

```text
server.ts                 Express production entry point
src/                      React application, routes, services and utilities
src/services/             Canonical domain/integration services
src/middleware/           Authentication and request middleware
tests/                    Automated verification suites
scripts/                  Maintained development/verification utilities
docs/                     Domain and audit documentation
public/                   Static frontend assets
translations/             Localization resources
dist/                     Generated production output (not source)
```

## Deployment

The canonical production process is:

1. Build with `npm run build`.
2. Run the generated server with `npm start`.
3. Deploy the resulting application to Google Cloud Run.
4. Bind production secrets through the deployment secret-management system.
5. Verify `/api/health` and execute live external acceptance tests.

Do not reintroduce the retired Python backend, MongoDB production path, Kubernetes prototype manifests, duplicate microservice stubs, or synthetic/mock production mutation paths.

## Production acceptance status

Automated repository hardening and regression verification can establish code readiness, but they do **not** replace live acceptance of external infrastructure.

The remaining external gates are:

- Real Hedera HCS transaction and consensus verification
- Real asymmetric VC issuance and tamper-rejection verification
- Physical weighbridge connectivity
- Production Cloud Run + Secret Manager verification

These should be completed only after the repository/build is frozen and the required production credentials and hardware are provisioned securely.
