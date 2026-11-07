# G-002 Legacy Workflow Fail-Closed Boundary — 2026-11-07

The repository still contains Phase-5 route/service/table definitions that do not match the authoritative live Neon workflow schema.

This batch prevents those legacy project workflow endpoints from performing global or stale-schema writes while the live replacement is being completed.

## Disabled legacy write surfaces

- project intake
- CCTS submission
- monitoring report
- audit package
- pilot issue creation/resolution

They now fail closed with `LEGACY_WORKFLOW_NOT_AUTHORITATIVE` after tenant context is established.

## Authoritative replacement direction

Use the live lineage:

Organization -> Carbon Project -> Activity -> Measurement/Evidence -> Carbon Calculation -> Verification -> Environmental Attribute Claim / Credential / Registry Event.

No compatibility tables are created and no production database mutation is performed.

## Gate status

G-002 remains BLOCKING / FAIL / OPEN until live-schema ORM reconciliation, remaining workflow conversion, two-organization A/B isolation rehearsal, migration-authority reconciliation, and runtime NOBYPASSRLS proof are complete.
