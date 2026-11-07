# G-002 Live Trust & Registry Adapter Batch — 2026-11-07

## Live production primitives reconciled

Read-only Neon schema evidence confirms the authoritative downstream lineage:

`activities -> verifications -> environmental_attribute_claims -> credentials -> registry_events`

Additional live structures:
- `evidence_verification_requirements` links activity/evidence/verification;
- `credentials` links activity, issuer organization, verification and methodology version;
- `registry_events` records credential lifecycle events with event hash and recorded identity;
- `environmental_attribute_claims` is organization-scoped and links activity/evidence/verification.

## Implementation

Added tenant-scoped adapters and routes for:
- verification;
- environmental attribute claims;
- credentials;
- registry events.

All new adapters use transaction-local tenant context and authoritative live tables. Legacy `carbon_claims`, `certificates`, `acva_cases`, and `findings` are not recreated.

## Important schema finding

The live database has no direct `activities.carbon_project_id` foreign key. Project-to-activity linkage is therefore represented by the existing `activities.metadata.carbonProjectId` field in the current adapter, while `carbon_calculations.carbon_project_id` remains the authoritative FK where calculations exist. A future schema evolution may formalize the project/activity FK, but this batch does not mutate production schema or invent a new table.

## Verification enum

Live `verification_decision` values are only `APPROVED` and `REJECTED`; the adapter targets that existing enum.

## Gate status

No production DB mutation, RLS change, role change, migration execution, deployment, or certification claim was made.

G-002 remains BLOCKING / FAIL / OPEN pending full write-path conversion, two-organization isolation rehearsal, migration-authority reconciliation, and runtime NOBYPASSRLS evidence.
