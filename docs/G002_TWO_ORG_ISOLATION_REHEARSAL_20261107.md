# G-002 Two-Organization Isolation Rehearsal — 2026-11-07

## Rehearsal branch
Neon branch: `rupaykg-tenant-isolation-lab-20261101`.

## Changes applied
RLS was enabled on the direct organization-scoped rehearsal tables:
- activities
- carbon_projects
- cpcb_swm_stakeholder_workspaces
- organization_epr_applicability
- organization_bwg_assessments
- bwg_reporting_periods
- epr_returns
- evidence_artifact_series
- environmental_attribute_claims
- credentials
- registry_events

The dedicated `rupaykg_app_runtime` role is NOBYPASSRLS/non-admin. Tenant CRUD policies were added for direct organization-owned tables. Credentials are scoped by `issuer_organization_id`. Registry events are intentionally bilateral: visibility is based on `from_owner_id` or `to_owner_id`, while creation requires the current organization to be the originating owner.

## A/B fixture
The branch contains:
- Org A: `11111111-1111-4111-8111-111111111111`
- Org B: `22222222-2222-4222-8222-222222222222`

Temporary activity fixtures were created and removed after rehearsal preparation.

## Executable evidence
`tests/g002_two_org_runtime_isolation_test.ts` performs the actual A/B read-isolation test when executed with `G002_RUNTIME_DATABASE_URL` pointing to the dedicated NOBYPASSRLS runtime connection. The test runs inside a transaction and rolls back its fixtures.

## Current result
Database inspection confirms RLS is enabled and G-002 policies exist:
- 10 direct-org tables: 4 CRUD policies each.
- registry_events: 2 explicit bilateral policies.
- credentials: 4 issuer-organization policies.

The runtime A/B test has **not been executed from this ChatGPT session**, because the available Neon SQL connection is the administrative BYPASSRLS connection and cannot substitute for the dedicated runtime identity. Therefore G-002 is **not marked PASS**.

## Production boundary
No production/main branch schema or role mutation was performed.

Next gate: execute the runtime test against the dedicated NOBYPASSRLS connection, then extend the same policy model to child/relationship tables and perform the full two-organization MRV lineage test before any production RLS change.
