# Sovereign-Grade Architecture Upgrade (V2)

The RupayKg CCC OS Pilot Engine has been retrofitted with sovereign-grade architecture scaffolding. 
This aligns with the mandate to preserve the existing waste-to-carbon functionality while preparing for national-scale production.

## Structural Transition
To manage the transition from a monolithic prototype to a modular Domain Driven Design (DDD) layout, the following directories act as the boundary contexts:

- \`apps/api/\`: Contains the future consolidated Express/Fastify entry point.
- \`core/\`:
  - \`security.ts\`: Centralized Helmet, CORS headers, Zod validation schemas, and JWT inspection.
  - \`config.ts\`: Production environment mappings (MongoDB, Redis, mTLS).
- \`services/\`: Contains domain boundaries:
  - \`auth-service/\`: RS256 JWT auth, BCrypt only, OTP fallbacks, and Redis Token Revocation.
  - \`wallet-engine/\`: Append-only architecture for credits/debits and idempotency keys.
  - \`ccc-engine/\`: Issuance doctrine, immutable proofs, W3C Verifiable Credentials.
  - \`mrv-engine/\`: Methodology registry, AI integration pipelines, and evidence chaining.
  - \`fraud-engine/\`: Biomass spike tracking, anomaly scoring, and geofence verification.
  - \`registry-service/\`: Append-only state transitions.
  - \`python-gateway/\`: Secure proxy routing to Python FastAPI services for AI processing and Biomass algorithms.
- \`workers/\`:
  - \`payout-worker/\`: Asynchronous state sweeping for negative balance prevention and hold/approval.

## Auth Hardening
- **Plaintext Fallback Ban:** Eliminated plaintext password fallback mechanisms.
- **Strict Cryptography:** \`bcryptjs\` with a cost factor (salt rounds).
- **Public/Private Keys:** Retained \`RS256\` asymmetric encryption for JWT generation to allow stateless validation by microservices.
- **Role Strategy Enforced:** 'ADMIN', 'GENERATOR', 'AGGREGATOR', 'RECYCLER', 'VERIFIER', 'REGULATOR'.

## Deployment Protocol (Kubernetes / Cloud Run)
- Container defaults strictly to \`0.0.0.0:3000\`.
- \`DISABLE_HMR=true\` behaves purely as a Vite distribution server wrapper.
- All secrets routed through ENV injected variables (vault).

*Refactoring is continuously integrated over the domain edges.*
