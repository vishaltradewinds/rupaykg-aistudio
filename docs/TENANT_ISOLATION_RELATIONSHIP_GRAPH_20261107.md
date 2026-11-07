# Tenant Isolation Relationship Graph — 2026-11-07

## Live rehearsal evidence

Source: production-derived Neon branch `rupaykg-role-split-rehearsal-20261106`.

The live schema contains a mature organization/identity model:

- `organizations.id` is UUID.
- `identities.id` is UUID.
- `organization_memberships` binds `identity_id` to `organization_id` and `role_id`.
- Organization-scoped business tables use direct `organization_id` or role-specific organization columns.
- Many non-organization tables inherit tenant scope through foreign-key relationships to organization-scoped parents.

## Direct organization columns

The live schema currently contains **31 organization-related columns across 31 tables**:

`activities.organization_id`,
`audit_events.organization_id`,
`bwg_profiles.organization_id`,
`bwg_reporting_periods.organization_id`,
`bwg_waste_reports.processor_organization_id`,
`carbon_projects.organization_id`,
`chain_of_custody_links.actor_organization_id`,
`cpcb_swm_stakeholder_workspaces.organization_id`,
`cpcb_swm_status_history.organization_id`,
`credentials.issuer_organization_id`,
`environmental_attribute_claims.organization_id`,
`epr_credit_transfers.from_organization_id`,
`epr_credit_transfers.to_organization_id`,
`epr_credits.issuer_organization_id`,
`epr_credits.recycler_organization_id`,
`epr_obligations.obligated_organization_id`,
`epr_returns.organization_id`,
`esg_reporting_periods.organization_id`,
`evidence_artifact_series.organization_id`,
`field_devices.organization_id`,
`obligations.organization_id`,
`organization_bwg_assessments.organization_id`,
`organization_epr_applicability.organization_id`,
`organization_geography_scopes.organization_id`,
`organization_memberships.organization_id`,
`organization_statutory_profiles.organization_id`,
`organization_verification_evidence.organization_id`,
`platform_access_change_requests.organization_id`,
`resource_flows.organization_id`,
`roles.organization_id`,
`stakeholder_applications.organization_id`.

## Identity-to-tenant boundary

The authoritative identity path is:

`identities` → `organization_memberships` → `organizations`.

This is materially stronger than the legacy application model in `src/db/schema.ts`, where the older `users` table carries `organization_name` as free text and does not expose a canonical organization UUID.

Therefore the existing Express authentication layer cannot safely be assumed to provide a tenant context for the newer organization-scoped schema.

## Isolation design consequence

RLS policies must use the authoritative identity/membership relationship, not:

- free-text `organization_name`;
- client-supplied organization IDs without server-side membership validation;
- role alone;
- geography alone.

For each organization-scoped table, policy design must distinguish:

1. actor organization;
2. resource organization;
3. cross-organization transaction parties;
4. platform/system workflows;
5. regulator/verifier workflows;
6. evidence and audit records;
7. background/worker operations.

Cross-organization tables such as `epr_credit_transfers` and settlement/registry records require explicit bilateral authorization semantics rather than a simplistic single-`organization_id` policy.

## Current gate

RLS remains disabled in production and rehearsal.

G-002 remains **BLOCKING / OPEN** until the authoritative application identity is mapped to `identities`/membership, policies are rehearsed, and A/B tenant isolation tests pass for direct and indirect relationships.

No production mutation was performed.
