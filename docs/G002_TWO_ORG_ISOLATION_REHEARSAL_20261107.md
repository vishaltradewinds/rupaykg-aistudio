# G-002 Two-Organization Isolation Rehearsal Gate — 2026-11-07

## Current evidence
The existing Neon branch rupaykg-tenant-isolation-lab-20261101 contains dedicated NOBYPASSRLS roles, but inspection shows RLS is enabled only on organization_memberships among the sampled authoritative tables. Activities, carbon_projects, CPCB/SWM workspaces, EPR applicability, BWG assessments, evidence artifact series, claims, credentials and registry_events remain without RLS in that branch.

Therefore this branch is a rehearsal environment, not proof of production tenant isolation.

## Required A/B test
Two organizations must be represented by separate active memberships and test data. Under the dedicated NOBYPASSRLS runtime identity:
1. Organization A context can read/write A rows.
2. Organization A cannot read B rows.
3. Organization A cannot update/delete B rows.
4. Organization B cannot read/write A rows.
5. Child MRV lineage cannot cross organization boundaries through activity joins.
6. Cross-owner registry operations remain explicitly authorized.
7. Legacy ownerId/organization_name paths cannot bypass tenant context.

## Release rule
Do not mark G-002 PASS until executable evidence exists for all seven controls and production RLS policies implement the same authorization semantics.

No production mutation was performed in this batch.
