# RupayKg Existing-Ecosystem Reuse Strategy

**Status:** Architecture decision proposal for review; no external integration is claimed active.  
**Rule:** Reuse working, supported systems before building or operating replacements.  
**Standard:** Shakti Standards; MeitY and other applicable Indian requirements are product/use-case specific.

## 1. Aim

Implement RupayKg's Hardware Anchor Layer by integrating with systems already available in the RupayKg application, the facility, and approved public/private ecosystems. Avoid unnecessary custom hardware, duplicated databases, parallel identity systems, and additional paid infrastructure.

## 2. Reuse-first hierarchy

1. **Existing RupayKg services:** inspect and reuse the current PostgreSQL/Drizzle data layer, authentication/RBAC, audit log, evidence lineage, methodology engines, API conventions, and any existing Hedera/W3C credential adapters. Extend canonical services; do not create parallel ones.
2. **Existing facility equipment:** use the installed weighbridge, scale, gas/environmental sensors, GPS tracker, barcode/QR process and operator phone where their interfaces and evidence are adequate. Purchase nothing until compatibility is checked.
3. **Existing software interfaces:** prefer the device's documented API/export, serial interface, Modbus/OPC-UA gateway, MQTT, HTTPS or CSV import as actually supported. Each interface must be confirmed from the device manual or a real test.
4. **Open-source software, only if needed:** evaluate an existing IoT/device-management component rather than writing one from scratch. Candidate examples are ThingsBoard Community Edition for telemetry/device management and ChirpStack for LoRaWAN networks. These are optional, not mandatory dependencies; deployment, security, licence, resource requirements and maintenance must be assessed before selection.
5. **Approved external ecosystems:** connect to government or partner systems only through a documented, authorized API, permitted data export or formal integration agreement. No scraping, credential sharing or assumption that a portal has an open API.
6. **New hardware/software:** build only for a documented gap that existing systems cannot meet.

## 3. Target integration pattern

```text
EXISTING FACILITY EQUIPMENT / OPERATOR PHONE
       | documented API, serial, Modbus/OPC-UA, MQTT, file import
       v
SMALL ADAPTER / CONNECTOR (only for required protocols)
       |
       v
EXISTING RUPAYKG AUTHENTICATION + API BOUNDARY
       |
       v
EXISTING POSTGRESQL/DRIZZLE + AUDIT/EVIDENCE SERVICES
       |
       v
EXISTING METHODOLOGY-SPECIFIC MRV VALIDATION & CALCULATION
       |
       v
EXISTING REVIEW / APPROVAL / REPORTING WORKFLOWS
       |
       +--> external trust or government integration only when configured,
            authorized, and the actual response is verified
```

A separate IoT platform is not required for a small pilot. Add ThingsBoard only if device fleet management, telemetry dashboards, alerting or protocol integration is a real unmet need. Add ChirpStack only if selected field devices use LoRaWAN and RupayKg needs to operate/manage that network. Do not add both by default.

## 4. Reuse inventory to complete before implementation

For every candidate capability, mark REUSE_AS_IS, EXTEND, ADAPTER_REQUIRED, EXTERNAL_AUTHORIZATION_REQUIRED, or NOT_PRESENT. Verify in the actual repository/deployment; do not infer from a document.

- Authentication, roles and device permissions.
- Site/facility, waste batch and custody identifiers.
- Existing observation/measurement tables and schemas.
- Audit logging and append-only evidence lineage.
- File/evidence storage and hash generation.
- Methodology engine input contracts and frozen methodology identifiers.
- Existing idempotency, queue/retry and offline mobile capabilities.
- Existing API middleware, validation, rate limiting and error handling.
- Existing external credential/ledger adapters and verification paths.
- Existing hosting, database and observability; avoid adding a paid service without explicit budget approval.
- Facility's actual weighbridge brand/model, output protocol, calibration records and vendor support.
- Existing operator phones, barcode/QR equipment, network coverage and power backup.

## 5. Public and regulatory ecosystem integrations

### CPCB Solid Waste Management portal
CPCB provides a Centralized Online Portal for Solid Waste Management and publishes information about registration and data reporting under the SWM Rules, 2026. Treat this as an authoritative operational/regulatory touchpoint. Before integration, verify the portal's current process, the applicable stakeholder role, the exact reporting obligation, and whether a supported API or authorized export exists. If no supported interface is available, provide a compliant manual/export workflow and evidence record; do not automate portal access by scraping or claim that RupayKg is officially integrated.

Portal: https://www.swm.cpcb.gov.in/

### API Setu and government data exchange
API Setu is MeitY's Open API platform. Search its directory for the exact government service needed and confirm API documentation, publisher, eligibility, consent, purpose, credentials and terms before using it. Listing on API Setu does not mean a required waste/MRV API exists or that RupayKg is automatically authorized.

Portal and documentation:
- https://apisetu.gov.in/
- https://docs.apisetu.gov.in/

### Open government data / other government platforms
Use a government dataset or exchange platform only when it has relevant, lawful data and the applicable terms permit the intended use. Preserve source, retrieval time, version and provenance. Do not treat public reference data as proof of a physical measurement.

### IoT platforms
- ThingsBoard Community Edition: candidate for self-hosted device management/telemetry where needed. Official documentation: https://thingsboard.io/docs/
- ChirpStack: candidate LoRaWAN network server when the deployment actually uses LoRaWAN. Official documentation: https://www.chirpstack.io/docs/

Confirm licence, hosting/security, support, upgrade path, and the total cost before adoption. Open-source software is not automatically secure, compliant, or free to operate.

## 6. MeitY and product-specific compliance

The integration layer maintains a per-product compliance checklist. Evaluate MeitY/STQC scheme applicability, BIS compulsory requirements, WPC/DoT requirements for radio equipment, calibration/legal metrology and other relevant requirements based on the exact product, purpose, deployment and tender. Record official evidence and rationale.

No device is production-approved solely because it is Indian-made, listed by a vendor, or connected successfully. A compliance gap that is a legal or tender prerequisite blocks procurement/deployment.

Official references:
- STQC IoT System Certification Scheme: https://stqc.gov.in/en/iot-system-certification-scheme-iotscs
- BIS compulsory certification: https://www.bis.gov.in/product-certification/products-under-compulsory-certification/
- MeitY: https://www.meity.gov.in/

## 7. Data and trust rules

- Preserve raw source observations, normalized values, original units, timestamps, device/site identity, calibration reference, provenance and payload hashes.
- Never fabricate a reading or silently replace a missing value.
- Distinguish source event time from server receipt time.
- Detect duplicate/replayed records; retries must be idempotent.
- Quarantine invalid, unregistered, conflicting or inadequately supported observations.
- Do not let untrusted measurements enter an approved MRV calculation.
- External registry/ledger/credential states are reported successful only after real response and verification; provider outage means pending/failed, never simulated success.
- Follow purpose limitation, data minimization, access control and retention requirements.

## 8. Implementation batches and gates

### Batch A — Inspect and map
Inspect actual schema, routes, auth, audit, evidence, offline capability, integrations and hosting. Produce a reuse map with code paths and test evidence. Inspect the first facility's device manuals and interfaces. No purchases.

### Batch B — Minimal connector
Select one real input for the first pilot, preferably an existing weighbridge export/interface plus operator confirmation if that is what the site supports. Implement only the missing adapter and connect it to existing evidence services. Do not add an IoT platform unless Batch A demonstrates the need.

### Batch C — Validate end-to-end
Test valid/invalid payloads, device authorization, duplicate/replay, unit conversion, calibration validity, offline/retry, power/network failure, audit lineage and the block on invalid MRV inputs.

### Batch D — External integration
Integrate a CPCB/government/partner system only after documenting its supported interface, authorization and data-sharing conditions. Otherwise maintain an auditable export/manual process.

### Batch E — Field acceptance
Use real equipment and approved operating procedures at a controlled site. Collect test logs, calibration evidence, applicable product certificates and reviewer sign-off. Separate pilot acceptance from production approval.

## 9. Definition of done

- The reuse map is grounded in actual code and site equipment, not assumptions.
- No duplicate identity, database, audit or trust subsystem has been introduced.
- One real device/source is connected end-to-end with traceable provenance.
- Failure and invalid-data tests pass; no invalid evidence can produce approved MRV output.
- Any external connection has documented authorization and tested interface behavior.
- Applicable compliance evidence and operational sign-off exist before production use.

**Current status:** Reuse-first strategy documented. The actual code/site inventory, external credentials, device compatibility, and field validation remain to be verified.