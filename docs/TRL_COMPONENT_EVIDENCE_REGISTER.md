# RupayKg — TRL Component Evidence Register
Status: Baseline register; scoring intentionally withheld pending evidence review.
Review date: 2026-10-27.

## Scoring rule
Do not assign a single platform TRL by intuition or by counting files/tests. Cite the governing TRL definitions applicable to this project. Score each component against those definitions and retain evidence for every claimed level. If evidence is insufficient, use NOT ASSESSED. Source code or CI alone does not prove field readiness.

| Component ID | Component | Current evidence known | Missing evidence to collect | Initial status |
|---|---|---|---|---|
| TRL-SW-01 | Carbon OS application/APIs | Repository and build/test artefacts exist | Reproducible current build, deployed revision, monitoring, acceptance and security evidence | NOT ASSESSED |
| TRL-MTH-01 | BM-T-011 FOD engine | Reconciliation document records computational implementation | Official reference fixture or independently verified worked example; input-to-output reconciliation | AMBER |
| TRL-MTH-02 | BM WA03.001 | Partial match documented | Electricity/flaring details, gas density corrections, project/leakage sub-tools and reference cases | AMBER |
| TRL-MTH-03 | BM WA03.002 | Mapping document exists | Source/test traceability, pathway equations, units and reference reconciliation | NOT ASSESSED |
| TRL-MTH-04 | BM WA03.003 | Older audit says adapter interface only | Inspect current source; complete implementation and tests if still missing | NOT ASSESSED |
| TRL-IOT-01 | Edge acquisition/field instrumentation | Architecture described in project documents | Device inventory, calibration, firmware provenance, field data, disconnect/recovery tests | NOT ASSESSED |
| TRL-ID-01 | Identity/signing/verifiable credentials | Earlier checkpoint identified asymmetric signing as a gap | Cryptographic implementation, key management, interoperability and independent signature verification | NOT ASSESSED |
| TRL-REG-01 | Hedera/external registry anchoring | Earlier checkpoint identified consensus-write verification as a gap | Transaction ID, consensus receipt, retry/idempotency and independent read-back | NOT ASSESSED |
| TRL-OPS-01 | Site pilot and operating model | Jabalpur/Kathonda pilot documents exist | Actual deployment evidence, stakeholder acceptance, measured operations and incident/uptime records | NOT ASSESSED |
| TRL-SEC-01 | Security/resilience | Prior hardening notes and test claims exist | Current reproducible CI, threat model, external testing, backup/restore and incident evidence | NOT ASSESSED |

## Required evidence fields
For each component capture the selected TRL framework and exact definition; claimed level and rationale; source paths and commit SHA; test names/run URL/date/result/environment; deployment/site evidence and operating period where applicable; independent reviewer and review date; open risks and next gate.

## Decision policy
Report component readiness, critical-path bottlenecks, evidence confidence and separate overall platform conclusion. Do not average levels. Until the matrix is populated from current source and operational evidence, platform TRL remains NOT ASSESSED.
