# G-002 Live Workflow Write Adapter Batch — 2026-11-07

## Scope

This batch moves tenant-scoped MRV writes onto the live Neon workflow model instead of the legacy Phase-5 table model.

### Authoritative live write targets

- `activities`
- `measurements`
- `evidence`
- `carbon_calculations`

### Authorization boundary

Every write requires an already-resolved `TenantContext` and executes inside `withTenantTransaction`, setting transaction-local organization and identity context.

Project lineage is checked before activity/measurement/evidence/calculation writes. Activities carry the project reference in metadata because the live `activities` table does not expose a `carbon_project_id` column. Calculations carry the authoritative `carbon_project_id` foreign-key lineage.

## Safety

No production database mutation was performed. These are application-layer adapters only. Production RLS, runtime roles, and migration authority remain unchanged.

## Remaining G-002 blockers

- Convert/replace legacy intake/CCTS/monitoring/audit/pilot issue write services where live replacements are proven.
- Reconcile ORM schema definitions with the live database.
- Execute two-organization A/B isolation rehearsal on a non-production Neon branch.
- Establish migration authority and production runtime NOBYPASSRLS role.
