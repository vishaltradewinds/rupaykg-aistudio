# Shakti Standards — Integrated TRL + ICVCM Audit
Status: Engineering assessment baseline; not certification or external validation
Audit date: 2026-10-27

## Purpose and boundaries
Join Technology Readiness Level (TRL) assessment and ICVCM Core Carbon Principles (CCP) alignment into one evidence-driven lifecycle gate. This does not replace applicable Indian law, CPCB requirements, EPR obligations, Solid Waste Management Rules, BEE/CCTS methodology requirements, or competent-authority decisions. ICVCM is a complementary voluntary-market integrity benchmark.

No TRL level, regulatory conformity, CCP approval, credit issuance or production certification may be claimed without required evidence and authorized decisions.

## Evidence baseline
The existing CARBON_OS_REGULATORY_AUDIT.md records BM-T-011, BM WA03.001 and BM WA03.002 as adapter-ready/partial at that audit point; BM WA03.003 as not implemented at that point; and unit conversions and temperature/pressure corrections as gaps. It records deterministic calculation IDs, dataset IDs, SHA-256 hashes and simplified golden tests, while formula/unit exit criteria were partial.

WA03_001_BMT011_RECONCILIATION.md records BM-T-011 as computationally implemented but regulatory reconciliation AMBER pending authoritative numerical reconciliation; BM WA03.001 remains partial, with electricity, flaring, gas density and project/leakage sub-tools requiring reconciliation. These may represent different points in the codebase's evolution. Reconcile claims against current source, fixtures, tests, CI and dated evidence.

BEE's published Offset Mechanism list includes BM WA03.001 (landfill methane recovery), BM WA03.002 (flaring or use of landfill gas), BM WA03.003 (compressed biogas production) and BM-T-011 (emissions from solid waste disposal sites). Pin official source URL, version, retrieval date, source hash and applicability before freezing an adapter.

## Provisional TRL position
Overall platform TRL: NOT ASSESSED. The repository contains software, tests and pilot-readiness documentation, but these do not by themselves prove field-validated end-to-end operation. Score components separately; do not average them into a misleading platform score.

| Component | Evidence status | Gate required |
|---|---|---|
| Carbon OS application | Engineering evidence exists; TRL not assigned | Reproducible build, deployed revision, operational logs, security and acceptance tests |
| BM-T-011 | Computation documented; regulatory reconciliation AMBER | Official reference case, independent calculation and signed review |
| BM WA03.001 | Partial match documented | Pathway equations, unit conversions, temperature/pressure corrections and project/leakage emissions verified |
| BM WA03.002 | Mapping document exists; current status requires code/test audit | Complete pathway, reference fixtures and integration tests |
| BM WA03.003 | Older audit says interface only; current implementation must be inspected | Complete implementation, input schema, tests and official reconciliation |
| MRV hardware/edge | Requires deployment evidence | Calibration, device provenance, time sync, field acceptance and failure handling |
| Registry/VC/Hedera | Do not infer live integration from adapters/configuration | Verifiable transaction receipts, signature verification, idempotency and independent read-back |
| End-to-end pilot | Pilot documents exist; deployment outcome not established by documents alone | Site evidence, stakeholder sign-off, monitoring period, incident records and independent review |

Select and cite the governing official TRL framework before formal scoring. Assign levels 1–9 only where evidence meets the chosen definition. State the lowest critical-path component and evidence confidence.

## ICVCM CCP control mapping
This is an internal control mapping, not an assertion that RupayKg or a project is CCP-approved.

| Principle | RupayKg control intent | Minimum evidence / fail-closed condition |
|---|---|---|
| Effective governance | Accountable approvals, role separation, conflicts, grievances and controlled changes | Named owner, approval and policy version; block if absent |
| Tracking | Unique project/activity, monitoring period, batch, credit and retirement IDs | Unique constraints and registry reconciliation; quarantine duplicates |
| Transparency | Disclose methodology/version, assumptions, monitoring and status | Disclosure manifest with privacy/redaction; no unsupported claim |
| Independent validation and verification | Separate operator, preparer, reviewer and verifier roles | Independence evidence and signed reports; no self-verification |
| Additionality | Methodology-specific baseline and additionality evidence | Versioned evidence and reasoned human review; no AI-only approval |
| Permanence | Reversal-risk analysis, monitoring and remedies where applicable | Risk register and response plan; hold claim if missing |
| Robust quantification | Pinned methodology, lineage, units, uncertainty and conservative assumptions | Independent reference reconciliation; mismatch blocks issuance-ready status |
| No double counting | Unique identity, overlap detection and registry/retirement reconciliation | Conflicts quarantined pending resolution |
| Sustainable development safeguards | Environmental/social screening, rights, grievances and remediation | Evidence and sign-off; unresolved critical harm blocks clearance |
| Net-zero transition | Assess lock-in and transition consistency | Documented rationale and reviewer sign-off |

Version the current ICVCM Assessment Framework and Rule Architecture as references. Store source, version, effective date, retrieval date, hash and control mapping. New criteria create new versions and impact assessments; never rewrite past assessments in place.

## Two independent compliance lanes
Lane A — Indian statutory/regulatory: applicable law, CPCB/SWM/EPR, BEE/CCTS methodology/tools, eligibility, monitoring, verification and authority/registry decisions.

Lane B — voluntary integrity benchmark: ICVCM framework mapping, relevant crediting program/methodology status, independent assurance, disclosures and buyer-facing evidence.

A pass in Lane B never cures a failure in Lane A. A pass in Lane A does not establish CCP eligibility. ICVCM says the label requires a CCP-Eligible program and CCP-Approved methodology under its two-tick approach; RupayKg must not imply it can grant the label.

## Shakti evidence gates
1. G0 Reality/scope: site, stakeholders, jurisdiction, boundary, applicable law and intended claims.
2. G1 Source of truth: freeze official sources/versions, hashes, retrieval dates and applicability.
3. G2 Architecture/lineage: map input to evidence, calculation, reviewer and registry/claim.
4. G3 Engineering verification: unit, schema, property, negative, golden/reference, integration, security and regression tests.
5. G4 Methodology reconciliation: independent worked example and documented tolerance.
6. G5 Field validation: calibrated devices, actual operational evidence, recovery tests and stakeholder acceptance.
7. G6 Independent assurance: qualified independent validator/verifier and independence evidence.
8. G7 Production: security, backup/restore, observability, incident response, access control and rollback.
9. G8 Continuous assurance: source-version drift, periodic reassessment, incident handling and evidence retention.

Each gate records owner, evidence links, result, exceptions, approver and date. Critical missing evidence means FAIL-CLOSED.

## Execution batches
A. Inventory source, engines, schemas, API routes, tests, migrations, CI and deployment; reconcile previous audit claims.
B. Score component TRLs against an explicitly selected framework; classify evidence as verified, documented-only, missing or contradictory.
C. Map each CCP criterion to owner, data object, workflow, evidence and automated/manual test.
D. Align provenance, versioning, reviewer separation, duplicate detection, audit events and fail-closed release decisions.
E. Run relevant tests, add missing tests, inspect CI and capture commit/test evidence.
F. Publish combined gap register, component TRL findings, CCP coverage, statutory gaps and PASS/AMBER/FAIL statuses.

## Status rules
PASS = required current evidence exists, independent review where required, tests pass.
AMBER = partial implementation/evidence gap; explicit limits, no regulated/credit issuance claim.
FAIL = contradiction, failed test, missing critical control or unsupported claim.
NOT ASSESSED = insufficient evidence.

Never mark external validation, BEE acceptance, ICVCM approval, Hedera consensus write, W3C credential signing or field deployment complete without verifiable artefacts.

## References
- ICVCM CCPs: https://www.icvcm.org/core-carbon-principles/
- ICVCM Assessment Framework: https://www.icvcm.org/assessment-framework/
- ICVCM status: https://www.icvcm.org/assessment-status/
- BEE methodologies/tools: https://beeindia.gov.in/view_content.php?lang=1&lid=571
- Existing audit: https://github.com/vishaltradewinds/rupaykg-aistudio/blob/main/docs/CARBON_OS_REGULATORY_AUDIT.md
- Existing reconciliation: https://github.com/vishaltradewinds/rupaykg-aistudio/blob/main/docs/WA03_001_BMT011_RECONCILIATION.md
