# RupayKg Free-First, Viability-Gated Hardware & IoT Plan

**Status:** Decision policy and evaluation plan; not a procurement approval  
**Project:** RupayKg Carbon OS / Hardware Anchor Layer  
**Standard:** Shakti Standards  
**Current gate:** G0/G1 discovery and candidate evaluation  
**Procurement posture:** No purchase until a documented need, free-option assessment, viability review and explicit approval  
**Production posture:** Fail-closed; no hardware, calibration, compliance or pilot claims without evidence

## 1. Aim

Develop a reliable, auditable and maintainable hardware/IoT layer for RupayKg by reusing the existing platform and suitable devices first. Prefer open-source software and protocols and appropriately qualified Indian technologies where viable. Spend money only when no suitable free option is available, or a free option demonstrably fails a mandatory requirement, and the paid alternative is reasonably viable.

This plan does not authorize spending, supplier commitments, production deployment or certification.

## 2. Mandatory procurement rule

> **Free first. Pay only when necessary and reasonably viable. Never trade away safety, security, measurement integrity or legal compliance to save money.**

Every proposed purchase or paid service must pass all of these gates:

1. **Need established:** Identify the actual site workflow, measurement purpose, applicable MRV methodology and required technical capability.
2. **Reuse checked:** Inspect RupayKg's existing code, data contracts, devices, infrastructure and available services before adding a component or platform.
3. **Free alternatives searched:** Check suitable open-source projects, free SDKs/toolchains, public documentation, simulation, existing equipment and available government/research resources.
4. **Suitability evidenced:** Compare each viable free option against mandatory requirements: functionality, security, reliability, compatibility, support, licence, calibration, certification and lifecycle.
5. **Gap documented:** State precisely why the free option is unavailable, unsupported, technically inadequate, insecure, non-compliant or more costly in total lifecycle terms. Preference alone is not justification.
6. **Paid alternatives compared:** Obtain dated prices/quotes where feasible; compare at least two viable options where the market permits. Record exceptions where fewer options exist.
7. **Total cost assessed:** Include hardware, tooling, integration, freight/tax, licences, cloud usage, connectivity, calibration, certification, maintenance, spares, support and replacement.
8. **Viability approved:** Confirm expected benefit, schedule, maintainability, supplier support, lock-in risk and fit with the pilot.
9. **Explicit approval:** No purchase, paid subscription, paid API, billable cloud activation or supplier commitment without the user's explicit approval of the cost and purpose.
10. **Reassess periodically:** Revisit paid dependencies when a suitable free alternative appears or costs/requirements change.

A nominally free option is not suitable if it cannot meet a mandatory requirement. Conversely, a paid option is not justified merely because it is more convenient or newer.

## 3. Free-first order of preference

Evaluate in this order, skipping a tier only with a recorded rationale:

1. Existing RupayKg functionality and equipment already available at the site.
2. No-cost local inspection, source-level analysis, documentation review and simulation.
3. Suitable open-source software, protocol implementations, SDKs and toolchains, after licence and maintenance checks.
4. Suitable no-cost public/research resources or development-board examples, subject to availability and permitted use.
5. Existing compatible commercial instruments/controllers already owned or deployed at the pilot.
6. A paid off-the-shelf component or specialist service, only when the preceding options fail a documented requirement.
7. Custom PCB/controller design or custom silicon only after a proven need, prototype evidence, volume economics and a lifecycle plan. Custom silicon is out of scope for the initial pilot unless a separate evidence-based decision changes this.

## 4. RupayKg architecture to preserve

Reuse the canonical RupayKg device registry/enrollment, authenticated offline field-sync, evidence vault and MRV paths where compatible. Do not create a second production database, parallel evidence vault or duplicate trust/credential/ledger service.

Target flow:

```
Existing site instrument / sensor
  -> documented adapter or protocol interface
  -> optional edge controller/gateway and durable offline queue
  -> authenticated RupayKg field-sync/ingestion
  -> immutable source evidence + device/instrument/calibration references
  -> validation, quarantine and review
  -> approved methodology-specific MRV workflow
```

An edge gateway is optional. Do not introduce a new IoT broker/platform unless the actual requirements and cost comparison show it is needed. Do not select methane/gas sensors, weighbridge equipment or other measurement hardware until the approved site workflow and exact instrument requirements are established.

## 5. Candidate technology assessment — preliminary, not approved

| Candidate | Potential role | Free-first evaluation | Current decision |
|---|---|---|---|
| IIT Madras SHAKTI | Processor IP / possible future embedded controller | Review official licence, SDK/toolchain, supported implementation, board availability, peripheral support, security features, supply/support and commercial-use terms. | Evaluate; no production board or certification assumed. |
| C-DAC VEGA / ARIES | Indian processor and embedded development-board ecosystem | Verify exact board revision, current availability and price, software/board support, peripheral mapping, licence and technical support directly from official sources. | Evaluate alongside SHAKTI; no procurement approved. |
| Existing industrial gateway/controller | Practical route to a first physical interface | First inspect site equipment and existing interfaces; compare reuse cost against a new device. | Preferred for early delivery if already available and suitable. |
| Zephyr or another supported open-source RTOS | Embedded firmware on compatible targets | Verify exact board, drivers, security/update support, licence and maintained releases. | Candidate only after board selection. |
| Linux-based edge gateway | Local adapters, buffering, monitoring and secure networking | Reuse existing hardware where practical; verify update support, power, storage and security requirements. | Optional; not required for every pilot. |
| Modbus, RS-232/RS-485, Ethernet, MQTT | Device interfaces / communications | Use only when the actual instrument and existing RupayKg contract support the specific protocol; obtain register map and protocol details. | Interface choices remain instrument-dependent. |

Official starting points to review at the time of decision:
- SHAKTI: https://shakti.org.in/getting_started.html
- SHAKTI software: https://shakti.org.in/software.html
- C-DAC VEGA: https://www.cdac.in/index.aspx?id=product_details&productId=VEGAMICROPROCESSORS
- C-DAC ARIES IoT v2.0: https://www.cdac.in/index.aspx?id=product_details&productId=ARIESIoTv2.0
- Zephyr project: https://www.zephyrproject.org/
- STQC IoT System Certification Scheme: https://stqc.gov.in/en/iot-system-certification-scheme-iotscs
- BIS compulsory certification: https://www.bis.gov.in/product-certification/products-under-compulsory-certification/
- MeitY: https://www.meity.gov.in/

These references are starting points, not proof of present stock, free board availability, production readiness, applicable certification or product approval. Verify the exact product/model and current source evidence before a decision.

## 6. MeitY and product compliance gate

Assess applicability for the exact product, deployment and procurement context. Do not assert blanket MeitY approval or assume every component has the same regulatory route.

Where applicable, document current evidence for:
- MeitY orders, procurement conditions and local-content requirements.
- STQC IoT system certification scope/requirements.
- BIS registration, standards or quality-control orders.
- WPC/DoT requirements for radio equipment.
- Legal metrology for weighing instruments and associated measurement use.
- Electrical safety, EMC, environmental/IP rating and calibration requirements.
- Data security, firmware update and product support obligations.

For each requirement, record one of:
- `APPLICABLE_AND_EVIDENCED`
- `NOT_APPLICABLE_WITH_RATIONALE`
- `BLOCKED_PENDING_EVIDENCE`

A blocked mandatory prerequisite prevents purchase for production deployment or prevents release until resolved. Do not equate Indian design, Indian assembly, open-source licensing or government-research origin with automatic certification.

## 7. Measurement integrity requirements

For every field observation, preserve or link, as applicable:
- Device and instrument identity, manufacturer/model/serial and firmware.
- Site, capture context, source time and server receipt time.
- Original raw payload, value, original unit, normalized value/unit and parser/adapter version.
- Sequence/idempotency information and payload hash.
- Calibration certificate/reference, validity interval and status at measurement time.
- Operator/device authorization, location/context where required, validation status and review history.
- Any anomaly, missing evidence, clock uncertainty, correction or quarantine reason.

Detect duplicates/replays, invalid units, malformed payloads, expired/missing calibration, out-of-range readings and identity mismatches. Preserve original evidence; corrections must be linked rather than silently overwriting source readings. Invalid or untrusted measurements must not progress into an approved MRV result.

A connected sensor reading is not automatically a verified carbon reduction or credit.

## 8. Cost and decision record template

Complete one record for every paid dependency or purchase proposal.

- Decision ID:
- Requirement / pilot workflow:
- Proposed item/service and exact model/version:
- Why it is needed:
- Existing equipment/code reused:
- Free options searched and evidence links:
- Licence and commercial-use review:
- Requirements each free option fails (with evidence):
- Paid options and dated quotes:
- Upfront cost and currency:
- Recurring costs and billing triggers:
- Integration, support, calibration, certification and maintenance costs:
- Security and supply-chain risks:
- MeitY/STQC/BIS/WPC/legal-metrology applicability and evidence:
- Expected benefit and measurable acceptance criteria:
- Lifecycle cost and exit/replacement plan:
- Recommendation: `FREE_OPTION` / `PAID_OPTION_JUSTIFIED` / `HOLD_FOR_EVIDENCE` / `NOT_REQUIRED`
- Approver and approval date:
- Reassessment date / trigger:

If prices or compliance evidence cannot be verified, mark them unknown and hold the decision rather than inventing estimates.

## 9. Implementation batches

### Batch 1 — No-cost discovery (current)
- Review existing hardware-anchor documents and canonical RupayKg code paths.
- Build a requirements-to-candidate compatibility matrix.
- Identify the actual pilot workflow and request/locate the exact site instrument inventory, model, interface manuals, calibration evidence and required methodology parameters.
- Review SHAKTI and C-DAC official documentation and licensing.
- Produce a cost/availability evidence register. No purchase.

### Batch 2 — No-cost software prototype
- Use simulated/test-labelled observations and public tools to test adapter/data contracts.
- Test authentication assumptions, units, sequence/idempotency, replay/duplicate handling, invalid/missing calibration, offline buffering and recovery.
- Ensure test data cannot be mistaken for live evidence.
- Reuse the existing RupayKg field-sync/evidence pathway where compatible. No paid cloud/API activation.

### Batch 3 — Board and instrument selection gate
- Compare available candidates against the exact interface and performance requirements.
- Obtain dated quotes only if a free/reused option cannot satisfy the requirement.
- Document total cost, regulatory applicability and the reasons a paid choice is viable.
- Request explicit approval before any purchase or paid activation.

### Batch 4 — Bench prototype
- Integrate the selected physical board and real test sensor/instrument only after approval.
- Validate readings against a suitable reference, power/network failure recovery, device identity, security, calibration links and evidence lineage.
- Keep bench/test observations out of production MRV.

### Batch 5 — Controlled field pilot
- Use the actual site instrument only after its model, interface, operating permissions and calibration/provenance evidence are verified.
- Pass acceptance tests and applicable safety/security/regulatory gates.
- Separate field-pilot acceptance from production certification/approval.

### Batch 6 — Production and continuous assurance
- Release only after required approvals, monitoring, incident response, maintenance, firmware update, spare/replacement and rollback plans are evidenced.
- Requalify material hardware, firmware, supplier or measurement-method changes.

## 10. Shakti Standards gates and stop conditions

- G0 Requirements and context: exact site, purpose and methodology inputs known.
- G1 Regulatory applicability: applicable requirements and evidence paths documented.
- G2 Free-first selection and cost viability: alternatives, lifecycle cost and approval record complete.
- G3 Software/data contract: authentication, provenance, calibration linkage, replay controls and tests reviewed.
- G4 Bench acceptance: real device readings and failure-path tests pass.
- G5 Controlled field acceptance: real site interface and end-to-end evidence lineage proven.
- G6 Regulatory/measurement approval: required calibration/certification and authorized review completed.
- G7 Production release: operational, security, maintenance, rollback and monitoring gates passed.
- G8 Continuous assurance: drift, vulnerabilities, calibration expiry, supplier changes and costs monitored.

Stop and hold when site requirements, exact model/interface, calibration, required certification, cost viability or authorization is unknown. Documentation alone does not pass an engineering or deployment gate.

## 11. Current status and next action

- Existing hardware-anchor architecture and repository inventory are documented in the companion files.
- This plan is a decision and execution framework; it does not implement a device driver or prove a physical integration.
- No purchase, subscription, paid API, cloud billing activation, custom PCB or custom silicon is approved by this document.
- Next action: complete Batch 1 with a compatibility matrix and evidence-backed free/paid decision record; do not begin hardware procurement until the gate is satisfied.

**Decision principle:** ONE SHAKTI STANDARD. MANY PROJECT-SPECIFIC OPERATING SYSTEMS. Apply the same lifecycle and evidence gates to every hardware and IoT choice, while selecting only the components the actual RupayKg use case requires.
