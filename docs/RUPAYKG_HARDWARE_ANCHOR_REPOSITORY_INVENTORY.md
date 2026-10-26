# RupayKg Hardware Anchor — Repository Inventory and Integration Decision

**Date:** 2026-10-26  
**Status:** Static source inventory completed from the GitHub repository contents. No application runtime, live database, deployment, or field device was accessed during this review.  
**Decision standard:** Shakti Standards; reuse operational systems first; fail closed; no paid service or hardware purchase without a demonstrated need and approval.

## 1. Aim

Implement the Hardware Anchor Layer by extending RupayKg's existing field-device enrollment, authenticated field sync, evidence vault, measurement/MRV, and audit/provenance paths. Avoid creating a parallel IoT platform or a second device registry.

## 2. Canonical repository decision

The repository `vishaltradewinds/rupaykg` has a workspace-based TypeScript/Fastify/PostgreSQL architecture and contains field-device enrollment/provenance migrations, offline sync, field capture UI, evidence-vault routes, and MRV/Guardian/Hedera paths.

The separate `vishaltradewinds/rupaykg-aistudio` repository is a React/Vite + Express + Drizzle/PostgreSQL application with a separate schema and a legacy `PhysicalEvidenceGateway`. Its service accepts broad `any` payloads and writes physical readings directly. Do **not** copy this service into the canonical repository or create a second production persistence path. Reuse its domain ideas only after adapting them to the canonical repository's auth, schema, validation, evidence, and MRV contracts.

## 3. Verified source map

| Capability | Existing source | Finding / implementation consequence |
|---|---|---|
| Field device registry | `migrations/003_identity_geography_operations.sql` | `field_devices` already exists with a unique device identifier, identity and organization bindings, status, last-seen time, and metadata. Reuse it. |
| Enrollment governance | `migrations/016_field_device_enrollment.sql` | Device management is permission-gated; verified identity/organization/device binding is protected from mutation. |
| Enrollment provenance | `migrations/017_field_device_provenance.sql` | Registration and verification actor/time fields already exist. Extend only for a specific missing requirement. |
| Offline intake and replay protection | `migrations/009_field_sync.sql`, `migrations/011_field_sync_application.sql` | Durable envelopes include idempotency key, sequence, capture/receipt times, payload hash, status, cursor and applied entity. Processed envelopes are protected from key payload changes. |
| Device binding for legacy operation sync | `migrations/034_operation_sync_device_binding.sql` | Database trigger rejects missing/unregistered/unverified devices and actor/device identity mismatch. |
| Sync validation/application | `apps/src/sync-validation.ts`, `apps/src/sync-routes.ts` | Envelope schema validation, authenticated identity, verified-device requirement, organization/geography authorization, transactional application and measurement/evidence operation types exist. |
| Field capture/offline contract | `packages/domain/src/field-operations.ts`, `docs/FIELD-OPERATIONS.md` | Capture context, idempotency, monotonic sequence, GPS range checks and explicit conflict behavior exist. GPS is metadata, not proof of physical activity. |
| Field-device governance UI | `apps/web/src/field-device-panel.tsx` | Existing enrollment and verification workflow is present; use rather than build a separate console. |
| Evidence ingestion | `apps/src/evidence-vault-routes.ts`, `migrations/20261021_evidence_artifact_vault.sql`, `docs/MRV_EVIDENCE_VAULT.md` | Existing authenticated, organization/geography-scoped, size-limited upload supports content validation, SHA-256, versions, and review. It is suitable for calibration certificates and device documentation once evidence type and access rules are confirmed. |
| MRV and external trust | `apps/src/mrv-routes.ts`, `apps/src/guardian-mrv.ts`, `apps/src/hedera-anchor.ts` | Existing MRV handoff and fail-closed Guardian/Hedera boundaries should remain canonical. Do not report successful external anchoring without a verified provider response. |
| Migration validation / tests | `package.json`, `scripts/validate-migrations.mjs`, `apps/src/operation-sync-security.test.ts`, `apps/src/sync-validation.test.ts` | Existing migration and security-test infrastructure can be extended. Runtime tests have **not** been run as part of this static inventory. |

## 4. Gaps that source review does not establish as solved

1. **Physical instrument identity:** the existing field-device record is not, by itself, proof of the instrument's manufacturer, model, serial number, firmware, physical port/protocol, or ownership. A field-device UUID must not be treated as a calibrated measuring instrument.
2. **Calibration gate:** the reviewed canonical measurement operation validates value/unit/method/source/time, but this review has not established a mandatory instrument-specific calibration certificate/validity check before a physical reading can enter an approved MRV dataset.
3. **Raw device provenance:** field-sync envelopes store device/identity, capture time, idempotency key, payload hash and applied entity type/ID, so a source-envelope-to-measurement link is available at the application ledger level. The physical measurement row itself does not appear in the reviewed `MEASUREMENT_CREATE` insert to directly persist a device/instrument or calibration ID. Keep the envelope join intact and add explicit instrument/calibration references before approving physical readings for MRV.
4. **Interface compatibility:** no real weighbridge/sensor make/model, manual, register map, API credentials, serial settings, Modbus map, export file, or test payload has been supplied/verified. Therefore no physical protocol adapter can responsibly be selected or claimed operational.
5. **Facility authorization and live data:** the Jabalpur source register labels important facility sources as pending or secondary; live facility evidence and exact instrument inventory remain required.
6. **Deployment state:** repository source does not prove that a particular commit is deployed, a migration has run on production, or an external service is connected.

## 5. Reuse-first integration decision

- **Do not add ThingsBoard or ChirpStack now.** No verified need for a separate fleet manager or LoRaWAN network has been established. Reconsider only if the actual device inventory proves the gap and hosting/support cost is acceptable.
- **Do not add a new database or parallel device registry.** Extend the canonical `field_devices`, field-sync envelope, existing evidence vault, and MRV path.
- **First integration candidate:** use the site's existing weighbridge export or documented interface if the pilot confirms one exists. If no machine interface is available, begin with a controlled CSV/manual evidence intake using the existing evidence vault, while keeping the reading pending review.
- **External portals:** treat CPCB and other government systems as authorized reporting touchpoints. Use an API only after confirming the specific API, permitted purpose, access approval, credentials and provider terms. API Setu is a discovery/access platform, not proof that a particular waste/MRV API is available to RupayKg.
- **MeitY/STQC/BIS/WPC and calibration/legal-metrology applicability:** assess against exact device, use case, tender and deployment. A successful connection or Indian assembly does not equal compliance approval.

## 6. Required next implementation batch

### Batch A — Close source-level contract gaps
1. Trace the full `/api/v1/field-sync/envelopes` intake and `/api/v1/field-sync/envelopes/:envelopeId/apply` path through `MEASUREMENT_CREATE`, evidence association and MRV observation creation.
2. Preserve the existing envelope-to-applied-entity linkage; add an explicit source-envelope and instrument/calibration reference on physical measurement records if required by the MRV evidence contract. Populate these only from authenticated server context, never trusted client-supplied IDs.
3. Define a versioned instrument profile with manufacturer, model, serial number, firmware, site/facility binding, protocol, units, provenance/origin evidence and applicable compliance status.
4. Add calibration records and a fail-closed gate for any methodology-required calibration. Expired, missing, mismatched or unverifiable calibration must leave the reading quarantined/pending and excluded from approved MRV calculation.
5. Add regression tests for valid/invalid instrument binding, duplicate/replayed readings, source-envelope lineage, unit handling, missing/expired calibration, cross-organization access and offline retry.

### Batch B — Connect one real site input
1. Collect the facility-authorized instrument list and the exact manual/export/API/protocol specification.
2. Choose one existing interface based on evidence, not preference.
3. Implement only the required adapter; preserve raw bytes/record, original unit/time, normalized values, source hash and adapter version.
4. Test against a redacted real sample/export or a hardware-in-the-loop test before allowing any production MRV handoff.

### Batch C — Acceptance and release
Run migration validation, typecheck, build, the complete available test suite, adversarial sync tests, and end-to-end acceptance with the actual pilot data. Verify deployment separately. Production certification remains **HOLD** until site, instrument, calibration, legal applicability, security, and live-data gates are evidenced.

## 7. External reference

API Setu's official guidance states that consumers must discover the relevant API, subscribe, and obtain the API provider's approval and credentials before use. See the official [API Setu SOP](https://apisetu.gov.in/sop) and [permitted use and access](https://docs.apisetu.gov.in/document-central/terms-of-use/Permitted%20Use%20and%20Access.html).

## 8. Truthful status

**Completed:** source-level repository inventory and reuse decision documented.  
**Not completed:** code changes, runtime tests, database migration execution, live deployment verification, device-interface testing, calibration validation, MeitY/STQC/BIS/WPC determination, or pilot acceptance. These are explicit next gates, not implied successes.
