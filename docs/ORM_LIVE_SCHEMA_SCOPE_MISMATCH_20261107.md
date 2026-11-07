# ORM ↔ Live Schema Scope Mismatch — 2026-11-07

## Finding

The canonical branch's current `src/db/schema.ts` is materially older than the live production schema.

The repository schema still models legacy tables such as `users`, `records`, `farmers`, `carbon_events`, `compliance_records`, `pilot_onboardings`, and related legacy structures.

The live production-derived Neon schema contains the newer organization/identity/MRV architecture, including:

- `organizations`
- `identities`
- `organization_memberships`
- `organization_bwg_assessments`
- `organization_epr_applicability`
- `organization_statutory_profiles`
- `organization_verification_evidence`
- `activities`
- `carbon_projects`
- `evidence_artifact_series`
- `field_devices`
- `mrv_observations`
- `mrv_provenance_events`
- `registry_events`
- `verifications`
- and other current production tables.

## Security consequence

Tenant isolation cannot safely be implemented by assuming the legacy Drizzle schema is the complete authoritative model.

The live database must first be reconciled with the repository ORM/schema representation, or the application must explicitly establish which data-access layer is authoritative for each current production table.

In particular, the current authentication middleware populates `req.user` from the legacy `users` model and exposes `organization_name` as free text. The live tenant boundary is instead represented by:

`identities → organization_memberships → organizations`.

Therefore a production RLS rollout against the live organization schema must not be wired to the legacy free-text user organization field.

## Gate impact

This strengthens G-002 from a simple RLS gap into an **authority + ORM/schema + identity-context reconciliation gate**.

No production mutation has been performed.

## Required closure sequence

1. Freeze the live schema baseline.
2. Reconcile live schema ↔ repository ORM/data-access model.
3. Establish the authoritative identity-to-membership lookup.
4. Implement trusted per-transaction tenant context.
5. Apply the rehearsal RLS migration.
6. Execute A/B direct and indirect isolation tests.
7. Reconcile application grant matrix.
8. Add CI/runtime guards.
9. Only then prepare production activation.
