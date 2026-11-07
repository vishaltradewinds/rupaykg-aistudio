# G-002 Legacy Global Workflow Fail-Closed Boundary — 2026-11-07

## Decision

Repository-era global carbon namespaces that have not yet been reconciled to the live tenant-scoped Neon schema are now explicitly fail-closed at the router boundary.

Blocked namespaces:
- /kathonda
- /rural
- /legal-entities
- /icm
- /programmes
- /generic-cpas
- /cpas
- /monitoring-periods
- /carbon-rights
- /mrv-packages
- /acva-engagements
- /urban
- /pilot/issues

## Reason

The live production database and ORM are not yet schema-equivalent for these legacy surfaces. Allowing global queries or writes to continue would create a cross-tenant authorization and data-lineage risk.

The response is deterministic:
`409 LEGACY_WORKFLOW_NOT_AUTHORITATIVE`

This is a containment control, not a claim that the underlying capability is complete.

## Still allowed

Public/informational surfaces that do not expose tenant-private records remain outside this boundary, including the public project summary and methodology calculation/reconciliation exposure.

## Next conversion target

Replace each blocked namespace with a live-schema adapter only after:
1. live schema/FK reconciliation,
2. tenant authorization design,
3. two-organization rehearsal,
4. contract/regression test,
5. runtime NOBYPASSRLS proof,
6. production deployment evidence.

No production database mutation was performed by this change.

G-002 remains BLOCKING / FAIL / OPEN.
