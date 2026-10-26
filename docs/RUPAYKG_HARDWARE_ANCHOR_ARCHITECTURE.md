# RupayKg Hardware Anchor Layer — Architecture and Implementation Plan

**Status:** Architecture proposal; not evidence of deployed hardware or regulatory certification  
**Applies to:** RupayKg Enterprise 3.0 / Carbon OS  
**Standard:** Shakti Standards  
**Decision:** Hybrid hardware sourcing; MeitY and other applicable Indian requirements assessed per product category  
**Production posture:** Fail-closed for MRV approval and regulatory claims

## 1. Aim and non-goals

Create a vendor-neutral boundary between physical waste operations and RupayKg's MRV, custody, calculation, and evidence workflows. Start with commercially available devices and existing weighbridge interfaces. Prefer qualified Indian products and manufacturing where practical; allow imported components when needed.

This document does not claim that all components are Indian-made, that a particular device is certified, or that a live physical integration has been completed. Do not procure custom electronics until a pilot demonstrates the need.

## 2. Logical architecture

```text
PHYSICAL FACILITY
  Weighbridge / load cells / gas & environmental sensors / GPS tracker
  / field operator Android phone or tablet
          |
          v
DEVICE & ADAPTER BOUNDARY
  Vendor-specific adapters | protocol parsers | device registry
  calibration metadata | firmware/model identity | health status
          |
          v
EDGE GATEWAY (optional where needed)
  Local queue | monotonic sequence | signed batches | clock status
  encrypted local storage | offline operation | safe retry
          |
          v
INGESTION API
  Device authentication | schema validation | replay/idempotency checks
  rate limits | payload size limits | quarantine invalid observations
          |
          v
EVIDENCE LEDGER / OPERATIONAL STORE
  Raw observation (immutable) | normalized observation | provenance
  calibration & certificate references | operator/site/device linkage
          |
          v
MRV VALIDATION GATES
  Unit and range checks | calibration validity | time/location checks
  duplicate/anomaly review | method-specific completeness checks
          |
          v
CARBON OS CALCULATION ENGINE
  Versioned methodology adapter | deterministic calculation
  calculation inputs/outputs | dataset ID | hashes | reproducibility
          |
          v
REVIEW & APPROVAL
  Human/authorized reviewer | verifier evidence package | decision record
          |
          v
EXTERNAL TRUST / REPORTING
  W3C Verifiable Credential service and Hedera HCS only when configured,
  reachable and independently verified; otherwise pending/unavailable.
```

The edge gateway is optional. A simple pilot may use a field terminal or a supported device sending data through a secure API. Do not force an ESP32, RISC-V board, blockchain, or custom gateway into deployments that do not need it.

## 3. Layer responsibilities

### A. Physical source layer
- Connect only to identified and compatible sensors, trackers and weighing systems.
- Preserve source units, device serial/model, firmware version and calibration reference.
- Do not infer that a sensor is calibrated merely because it returns a numeric reading.
- A weighbridge integration must use the actual supported interface and approved operational procedure; never synthesize readings in production.

### B. Device adapter layer
Define a common adapter contract independent of vendor:
- `identify()`: device ID, manufacturer, model, firmware and protocol version.
- `readObservations()`: source observations with original units and source timestamps.
- `health()`: connectivity, power, clock and fault status where supported.
- `calibrationReference()`: calibration ID, certificate reference, validity dates and status where available.
- `verifyPayload()`: transport/source integrity checks appropriate to device capability.

An adapter must explicitly state unsupported capabilities. Do not label an unsigned device payload as cryptographically signed.

### C. Edge gateway (optional)
- Buffer records during network outages using a durable local queue.
- Assign a monotonically increasing sequence within the device/gateway identity.
- Encrypt stored data; restrict local access; protect keys using available secure hardware when practical.
- Use idempotent retry and never silently discard queued records.
- Record clock synchronization state; retain both source time and server receipt time.
- If the device clock or queue integrity cannot be trusted, mark the observations for review.

### D. Ingestion and device identity
- Use TLS in transit and per-device credentials/certificates where supported.
- Keep secrets server-side or in device-specific secure storage; never embed shared production credentials in a public app or repository.
- Support credential rotation and revocation.
- Enforce payload schemas, size limits, request authentication, rate limits and replay detection.
- Apply an idempotency key derived from device identity plus a stable source event/sequence identifier.
- Quarantine invalid or conflicting events; do not silently normalize away the evidence of a conflict.

### E. Evidence storage
Persist the following logical records (adapt names to the existing PostgreSQL/Drizzle conventions; do not create a parallel database):
- `device_registry`: device ID, type, manufacturer, model, serial/asset reference, firmware, owner, site, status, capability profile, origin declarations.
- `device_approvals`: product category, applicable requirement, issuing body, certificate/report identifier, scope/model, validity dates, evidence URI/hash, review status.
- `sensor_calibrations`: sensor ID, instrument/range, unit, calibration provider, certificate reference, effective/expiry dates, status.
- `field_observations`: immutable source payload, parsed value, original unit, normalized value/unit, event time, received time, device/site/operator, sequence, payload hash, idempotency key, validation state.
- `device_events`: firmware/config changes, faults, clock changes, credential rotation, tamper alerts and maintenance.
- `evidence_links`: link observation IDs to waste batches, custody events, sites, methodology runs and review decisions.
- `hardware_change_log`: hardware/firmware/model changes and requalification decisions.

Use migrations, indexes and foreign keys consistent with the current PostgreSQL and Drizzle stack. Avoid storing secrets or unnecessary personal data in evidence records.

### F. MRV validation and calculation boundary
Each observation must carry an explicit state:
`RECEIVED -> VALIDATING -> ACCEPTED` or `QUARANTINED`.
Accepted observations can still be marked `REVIEW_REQUIRED` or `CALIBRATION_EXPIRED`; these states must block any downstream approval that requires trusted measurements.

Validation gates:
1. Device is registered, enabled and authorized for the site and measurement type.
2. Payload schema and integrity checks pass.
3. Units are explicit and conversion is deterministic.
4. Reading is within documented physical/instrument limits; outliers are flagged, not silently deleted.
5. Calibration was valid at the event time where calibration is required.
6. Timestamp quality and offline sequence/replay checks pass.
7. Duplicate/conflicting observations are detected.
8. Methodology-required parameters and provenance are present.
9. A human review is required for quarantined or material anomalous data.

The calculation engine must consume only an explicitly selected, validated dataset and frozen methodology version. Every run records calculation ID, dataset ID, methodology/version, input hashes, outputs, unit conversions, warnings and reviewer status. A sensor observation alone is not a carbon credit, emission reduction, or verified environmental outcome.

### G. Trust, credentials and reporting
Reuse the repository's canonical Hedera and W3C credential services. Never implement a second signing/anchoring path. An external write or credential issuance is successful only after the real provider response and resulting transaction/credential have been verified. Missing credentials, provider outages, invalid signatures or unverifiable consensus must leave the operation pending/failed and must not fabricate a success state.

## 4. Suggested API boundary

Adapt route names to existing Express route conventions after inspecting the codebase. This is a target contract, not a claim that these endpoints already exist.

- `POST /api/hardware/devices` — register/update a device (authorized admin only).
- `GET /api/hardware/devices` — list authorized devices and status.
- `POST /api/hardware/observations` — authenticated device/gateway ingestion.
- `GET /api/hardware/observations/:id` — inspect an observation and its validation/provenance.
- `POST /api/hardware/observations/:id/review` — authorized reviewer decision with reason and audit event.
- `POST /api/hardware/devices/:id/revoke` — revoke device credentials/permission.
- `POST /api/hardware/devices/:id/maintenance-events` — record maintenance, calibration or firmware changes.
- `GET /api/hardware/compliance/:deviceId` — show product-specific requirement checklist and evidence status.

Every mutation must use existing authentication/RBAC, schema validation, audit logging and error handling. Do not expose secret material through API responses. Use versioned contracts and integration tests before adding routes.

## 5. MeitY and India compliance gate

Do not apply a blanket claim that every sensor or MCU needs the same MeitY approval. For each finished product and component category, document applicability and evidence before procurement or production deployment.

Check, as applicable:
- MeitY notifications/orders and current procurement tender conditions.
- STQC IoT System Certification Scheme scope and level, where applicable to the product/system.
- BIS compulsory registration or other applicable BIS/QCO requirements for the exact product category.
- WPC/DoT requirements for radio/telecom equipment, as applicable.
- Electrical safety, EMC, environmental/IP rating and calibration/legal-metrology requirements applicable to the installed equipment and use case.
- Public Procurement Preference to Make in India local-content and security requirements when bidding for a covered procurement.

Record a compliance decision as `APPLICABLE_AND_EVIDENCED`, `NOT_APPLICABLE_WITH_RATIONALE`, or `BLOCKED_PENDING_EVIDENCE`. The third state blocks production procurement/deployment where that requirement is a prerequisite. A vendor declaration or Indian assembly claim is not a substitute for a required certificate/test report.

Official references to re-check at each release:
- STQC IoT System Certification Scheme: https://stqc.gov.in/en/iot-system-certification-scheme-iotscs
- STQC certified-product list and current notices: https://stqc.gov.in/iot-system-certification-scheme-iotscs-0
- BIS products under compulsory certification: https://www.bis.gov.in/product-certification/products-under-compulsory-certification/
- MeitY orders and notifications: https://www.meity.gov.in/

## 6. Hardware origin and supplier register

For every candidate item, record:
- Manufacturer, product/model, SKU and datasheet revision.
- Design country and manufacturing country where evidenced.
- Imported versus locally made subcomponents, if declared and verified.
- Indian value-addition evidence only where relevant to procurement rules.
- Applicable certificates/test reports, scope, product model and expiry.
- Firmware update/support policy and vulnerability disclosure process.
- Interface/protocol, accuracy, operating range, ingress protection and power.
- MOQ, quoted price/date, lead time, warranty, replacement and service route.
- Evidence source, reviewer, date checked and unresolved risks.

Preferred sourcing order: qualified Indian product; Indian-designed/integrated product with disclosed imported components; otherwise a suitable global product with support and compliance evidence. Do not reject a safe, supportable product solely for foreign silicon, and do not accept an unsafe product solely for local origin.

## 7. Security and resilience requirements

- Device identity is unique; no shared fleet-wide secret.
- Secure transport, least privilege, credential revocation and rotation.
- Signed firmware/secure boot where the selected device supports it; record limitations where it does not.
- Immutable raw evidence plus append-only audit events; corrections create new linked records rather than overwriting source readings.
- Replay protection, idempotency, bounded retries and durable offline queue.
- Input validation and bounded payload sizes; protect ingestion from abuse.
- Monitor stale devices, clock drift, calibration expiry, repeated failures and abnormal reading patterns.
- Separate operational availability from MRV approval: a device can be online while its measurements remain untrusted.
- Backups, restoration tests and retention rules aligned to applicable contracts/regulations.
- No real secrets, personal data or production credentials in source control.

## 8. Pilot scope and acceptance tests

Start with one controlled site and only the measurements required by the selected MRV workflow. Candidate first integration: existing weighbridge output plus a field operator's Android terminal. Add environmental/gas sensors only if the approved methodology and site process require them.

Acceptance tests:
1. Correctly parse actual device output and preserve raw payload.
2. Reject an unregistered/revoked device.
3. Reject malformed payloads and detect replay/duplicate events.
4. Convert units deterministically and test boundary values.
5. Flag expired/missing calibration evidence.
6. Disconnect network, collect records, reconnect and prove no silent loss or duplicate acceptance.
7. Reboot/power-cycle and verify queue recovery.
8. Detect altered payload/hash and maintain an audit trail.
9. Prove invalid/quarantined data cannot enter an approved methodology run.
10. Verify reviewer actions are authorized and auditable.
11. Test secret rotation and device revocation.
12. Verify real external trust writes/credentials only when provisioned; otherwise confirm fail-closed behavior.
13. Complete applicable product, security, calibration and field safety checks.
14. Run build, regression, adversarial and persistence tests.

## 9. Shakti implementation gates

- **G0 — Requirements:** Site workflow, measurement purpose, methodology inputs, environment and operators documented.
- **G1 — Applicability:** Product categories and relevant MeitY/STQC/BIS/WPC/other requirements assessed with evidence.
- **G2 — Selection:** Candidate device and supplier evidence reviewed; cost and support validated.
- **G3 — Integration:** Adapter contract, schema, migrations, RBAC and API tests reviewed.
- **G4 — Bench verification:** Accuracy/interface, security, failure recovery and data integrity tests passed.
- **G5 — Controlled field pilot:** Real physical equipment used; observation lineage and operating procedures demonstrated.
- **G6 — Independent/operational approval:** Calibration and relevant certifications verified; methodology and MRV reviewers approve the evidence chain.
- **G7 — Production release:** Deployment/monitoring, rollback, support, incident response and change control approved.
- **G8 — Continuous assurance:** Monitor certificates, calibration, firmware vulnerabilities, supplier changes and drift; requalify material hardware/firmware changes.

No gate is passed by writing documentation alone. Each gate requires evidence appropriate to its scope.

## 10. Implementation batches

**Batch 1 — Discovery (no hardware purchase):**
- Inspect existing PostgreSQL/Drizzle schema, Express routes, RBAC, audit logging, offline queue and MRV evidence services.
- Map existing capabilities and avoid duplicate tables/services.
- Identify the exact first pilot site, weighbridge make/model/interface, required measurements and methodology inputs.

**Batch 2 — Data and API foundation:**
- Add only missing registry/observation/compliance structures through migrations.
- Implement schemas, authorization, ingestion, idempotency and quarantine.
- Add tests for fail-closed paths.

**Batch 3 — First real adapter:**
- Integrate the actual available weighbridge/device interface.
- Preserve raw source data and document adapter limitations.
- No simulated physical readings in production mode.

**Batch 4 — Pilot and compliance evidence:**
- Run controlled field tests and collect calibration/product/certification evidence.
- Close failures before considering production approval.

**Batch 5 — Expansion:**
- Add GPS/NavIC or environmental sensors only when the use case requires them and their product compliance is evidenced.
- Qualify additional vendors through the same adapter contract.

## 11. Definition of done

Architecture implementation is complete only when:
- Existing code has been inspected and the design reconciled with current services.
- Migrations and APIs are implemented without a parallel database or duplicate trust service.
- Unit, integration, security, regression and build tests pass.
- A real device supplies real observations and the provenance can be traced end-to-end.
- Invalid evidence is demonstrably blocked from approved MRV outputs.
- Applicable product/compliance evidence is verified for the deployment.
- The controlled pilot and production gates are separately signed off.

**Current status:** Proposed architecture documented. No hardware procurement, physical integration, regulatory certification or production approval is implied by this document.
