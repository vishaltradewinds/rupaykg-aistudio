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

### Next engineering gate

Convert tenant-sensitive call paths in coherent batches, beginning with project/workspace data, and test each batch against two organizations using the existing non-production RLS rehearsal. Cross-organization transaction tables require bilateral authorization semantics and must not be covered by a simplistic `organization_id = current_organization_id()` policy.

Production database and roles remain unchanged.
