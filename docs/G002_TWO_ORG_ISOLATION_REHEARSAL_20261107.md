# G-002 Two-Organization Isolation Rehearsal — 2026-11-07

## Rehearsal branch
Neon: `rupaykg-tenant-isolation-lab-20261101`.

## Direct organization isolation
RLS and tenant CRUD policies are enabled for direct organization-scoped tables including activities, carbon projects, CPCB/SWM, EPR, BWG, evidence artifact series, claims, credentials and registry events.

## Child MRV lineage isolation
RLS was additionally enabled on:
- measurements
- evidence
- evidence_artifact_versions
- mrv_observations
- mrv_provenance_events
- carbon_calculations
- verifications

Child policies resolve authorization through the parent `activities.organization_id`. This prevents a tenant from reaching another tenant's measurement/evidence/MRV/calculation/verification rows merely because the child row itself has no organization_id.

## Important boundary
`credentials` remains issuer-organization scoped. `registry_events` remains deliberately bilateral and must be governed separately from ordinary tenant CRUD.

## Evidence
The rehearsal database inspection confirms RLS + four CRUD policies on the seven child tables above. The actual A/B runtime test still requires execution through the dedicated NOBYPASSRLS runtime connection; the administrative Neon SQL connection cannot provide valid runtime-isolation evidence.

## Production gate
No production/main branch mutation was performed. G-002 remains OPEN until runtime A/B evidence and the remaining relationship/cross-tenant authorization tests are executed and recorded.
