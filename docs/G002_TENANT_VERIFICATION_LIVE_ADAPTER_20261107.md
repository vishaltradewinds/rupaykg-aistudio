# G-002 Tenant Verification Live Adapter — 2026-11-07

## Authoritative live table

`public.verifications` is the production verification primitive.

The adapter binds verification to:
- tenant organization through the parent activity;
- verifier identity;
- authorization membership and role;
- an authorization-permissions snapshot;
- evidence/activity lineage.

## Safety

No production mutation was executed while implementing this adapter. The application code is prepared for the live schema but production activation remains gated by schema/ORM parity, runtime-role and two-org rehearsal evidence.

## Status

G-002 remains BLOCKING / FAIL / OPEN.
