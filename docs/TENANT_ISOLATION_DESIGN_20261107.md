# RupayKg Tenant Isolation Design — 2026-11-07

## Status
Design-only. No production RLS or role mutation has been performed.

## Principle
Use PostgreSQL RLS as a database-level defense-in-depth boundary for organization-scoped data, while keeping complex authorization decisions in the application/service layer. Neon documents this hybrid approach for multi-tenant applications and notes that shared-tenant databases should use RLS to prevent cross-tenant access. citeturn462808search2turn462808search0

## Scope discovered in live production
23 tables explicitly contain `organization_id`:

- activities
- audit_events
- bwg_profiles
- bwg_reporting_periods
- carbon_projects
- cpcb_swm_stakeholder_workspaces
- cpcb_swm_status_history
- environmental_attribute_claims
- epr_returns
- esg_reporting_periods
- evidence_artifact_series
- field_devices
- obligations
- organization_bwg_assessments
- organization_epr_applicability
- organization_geography_scopes
- organization_memberships
- organization_statutory_profiles
- organization_verification_evidence
- platform_access_change_requests
- resource_flows
- roles
- stakeholder_applications

## Important boundary
The 23-table list is not the complete tenant-isolation set. Tables without `organization_id` can still contain tenant-owned records through foreign keys or indirect relationships. Those tables require relationship tracing before any RLS policy is written.

Examples requiring explicit lineage analysis include carbon calculations, evidence versions/reviews, MRV observations/provenance, field-sync envelopes/conflicts, settlements/settlement events, registry events and verification records.

## Required authorization model
Before enabling RLS:

1. Define the trusted organization identity source.
2. Define how the request's organization context reaches PostgreSQL.
3. Define behavior for missing/invalid organization context: fail closed.
4. Define platform-admin and system-worker exceptions explicitly.
5. Ensure application runtime does not use a role with `BYPASSRLS`.
6. Test cross-organization SELECT/INSERT/UPDATE/DELETE denial.
7. Test indirect tenant relationships, not only direct `organization_id` tables.
8. Test background jobs and privileged workflows separately.
9. Add regression tests to CI.

## Production safety
Do not enable RLS until the above model is implemented and verified on a Neon rehearsal branch cloned from production. Production remains unchanged during design and rehearsal.
