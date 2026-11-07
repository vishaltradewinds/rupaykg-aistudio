# G-002 MRV Assurance & Audit Lineage — 2026-11-07

Live production schema was reconciled read-only for:
- audit_events / platform_audit_chain_head
- evidence_verification_requirements
- mrv_observations
- mrv_provenance_events
- evidence_artifact_series / evidence_artifact_versions

Tenant-scoped read adapters now expose assurance lineage through the existing tenant context:
- evidence verification requirements
- MRV observations
- MRV provenance
- evidence artifact series/version counts
- organization audit events

The adapters derive organization scope through the live activities relationship where the child table lacks organization_id.

No production mutation was performed. Hedera HCS status remains evidence-dependent; these adapters do not assert that HCS anchoring is live.

G-002 remains blocking pending migration authority, runtime identity, RLS enforcement, and two-organization isolation rehearsal.
