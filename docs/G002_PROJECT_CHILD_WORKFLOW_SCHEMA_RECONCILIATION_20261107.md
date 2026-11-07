# G-002 Project Child Workflow Schema Reconciliation — 2026-11-07

## Finding

The first carbon project parent boundary has been converted to the live organization-scoped `public.carbon_projects` schema.

The next planned child-workflow conversion cannot safely proceed against the current repository ORM because the live production database does **not** contain the legacy child tables referenced by the repository:

- `project_intakes`
- `ccts_submissions`
- `monitoring_reports`
- `audit_packages`
- `pilot_issues`

A read-only information_schema query against the authoritative Neon production database returned none of those tables.

A broader read-only search for tables containing `intake`, `submission`, `monitor`, `audit`, `issue`, or `pilot` returned only:

- `audit_events`
- `platform_audit_chain_head`

## Consequence

This is a material **repository/live-schema divergence**, not a simple tenant-filtering task.

Blindly changing the existing service methods to use `organization_id` would be unsafe because the target tables themselves are not present in the authoritative live schema.

The correct Shakti execution sequence is therefore:

1. Freeze the live schema as authority.
2. Identify the authoritative live replacements/workspaces for each workflow domain.
3. Map each workflow's foreign-key lineage back to `carbon_projects.organization_id`.
4. Reconcile repository ORM definitions to those live structures.
5. Only then convert child workflow services.
6. Rehearse two-organization A/B isolation.
7. Do not create compatibility tables in production merely to make the legacy ORM compile.

## Production safety

No production schema, role, RLS policy, migration, or data was changed during this investigation.

## G-002 status

BLOCKING / FAIL / OPEN.

The parent project boundary is partially converted, but the child workflow boundary remains unproven until authoritative live workflow structures are identified.
