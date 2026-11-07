# G-002 Tenant Authorization Integration — 2026-11-07

## Batch outcome

The application authentication layer now attaches the authoritative tenant context opportunistically after successful authentication. This is a migration bridge, not a production authorization bypass.

### Implemented

- `attachTenantContext()` resolves the authenticated subject through the live identity/membership/organization model.
- `requireTenantContext()` remains the fail-closed gate for routes that are explicitly tenant-scoped.
- `withTenantTransaction()` establishes transaction-local PostgreSQL RLS context.
- P0 contract tests verify the integration.

### Important boundary

Authentication and tenant authorization remain separate decisions. A successful legacy `users` lookup does **not** prove organization authorization. Tenant-scoped routes must use `requireTenantContext()` before accessing tenant data.

### Why global enforcement is not yet enabled

The repository ORM schema still materially differs from the live database schema. Existing services directly use legacy tables and ownership fields. Globally enforcing the new tenant boundary before those call paths are reconciled could create either outages or incomplete isolation.

### Project call-path conversion batch — 2026-11-07

The first concrete tenant-sensitive batch is now implemented for the carbon project parent boundary:
- live `public.carbon_projects` was read-only inspected and confirmed to use `organization_id`, `project_code`, `title`, `methodology_version_id`, `status`, and related authoritative fields;
- `src/security/tenantCarbonProject.ts` now performs tenant-scoped project list/create/read operations through transaction-local tenant context;
- `src/routes/carbon.ts` now uses the authoritative project service for project list/create/read;
- `/projects/:id` child routes are guarded by an authoritative organization-scoped parent-project check;
- the legacy `ownerId` authorization path was removed from the carbon project CRUD routes;
- a P0 contract test was added to prevent regression.

This is application-layer enforcement only. Production RLS remains disabled and the legacy child services have not yet been declared fully tenant-safe. Child workflow services must be converted before G-002 can close.

### Next engineering gate

Convert the project child workflow services (intake, eligibility, CCTS submission, monitoring, audit package and pilot issues) so their database work executes inside the same authoritative tenant transaction boundary. Then run two-organization A/B rehearsal tests. Cross-organization transaction tables require bilateral authorization semantics and must not be covered by a simplistic `organization_id = current_organization_id()` policy.

Production database and roles remain unchanged.
