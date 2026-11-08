# RupayKg Environmental Operating System — Architecture Control Matrix

## Purpose

This matrix converts the canonical Environmental Operating System architecture into an engineering control register. It is deliberately conservative: a capability listed in the architecture is **not** marked production-complete merely because the repository describes or intends it.

## Current evidence basis

The initial matrix is based on the repository's canonical README and the adopted architecture document. Repository implementation, automated-test, infrastructure and field evidence must be attached before any row is promoted to Verified/Production.

## Control matrix

| ID | Layer | Required control | Repository evidence currently visible | Status | Next acceptance evidence |
|---|---|---|---|---|---|
| EOS-01 | Regulatory | Versioned authoritative regulatory sources and applicability rules | Canonical architecture defines this requirement; README describes MRV/CCTS workflows | **Architecture-defined** | Regulatory source registry + version/hash + applicability tests |
| EOS-02 | Evidence | Material claims have identifiable evidence lineage | README describes field evidence/GPS/offline workflows; architecture makes lineage mandatory | **Architecture-defined** | End-to-end evidence object → claim → calculation/report lineage test |
| EOS-03 | MRV | Deterministic, reproducible calculations with provenance | README describes MRV/CCTS workflows; architecture requires calculation IDs, datasets, provenance and hashes | **Architecture-defined** | Golden calculations + reproducibility + tamper/replay tests |
| EOS-04 | IoT / Measurement | Physical measurements are distinct from estimated/manual/simulated values | README identifies physical weighbridge integration as an external acceptance gate | **Acceptance-gated** | Real weighbridge capture, authenticity, reconciliation and failure-closed evidence |
| EOS-05 | Data | One authoritative live production path and tenant isolation | PostgreSQL/Drizzle is the declared persistence path, but core schema reviewed here does not expose a generic tenant/org boundary on `users`/`records`; runtime startup performs read-only table checks | **Gap confirmed — implementation required** | Identify authoritative tenant model; add/enforce tenant boundary in schema, queries and DB policy; verify RLS/isolation against live production DB; migration reconciliation and backup/restore evidence |
| EOS-06 | AI | AI remains assistive and traceable | Architecture defines AI controls; README does not establish production AI assurance evidence | **Gap / evidence required** | Model inventory, version/provenance, uncertainty, human-review and adversarial tests |
| EOS-07 | Registry / Integrity | Tamper-evident integrity for material records | Hedera provider explicitly fails closed without operator credentials; VC service fails closed without configured issuer private/public trust material; certification harness was found to generate ephemeral VC keys and has now been hardened to prohibit that substitution | **Acceptance-gated / certification harness corrected** | Real HCS consensus proof + real configured VC issuance/verification + tamper rejection + audit-chain verification |
| EOS-08 | Workflow | Explicit, auditable, recoverable state transitions | README identifies operational/governance workflows | **Architecture-defined** | State-machine inventory + transition authorization + recovery/replay tests |
| EOS-09 | Reporting | Reports derive from authoritative state and retain source traceability | README identifies ESG/stakeholder reporting; architecture defines reporting controls | **Architecture-defined** | Report-to-record lineage tests + versioned definition tests + RBAC/export tests |
| EOS-10 | Ecosystem Integrations | Each connector has data contract, trust boundary, auth, failure mode, owner and reconciliation | README identifies external integrations including Hedera, Guardian, LGD and weighbridge | **Control required** | Connector register + contract tests + failure/reconciliation evidence |
| EOS-11 | Security | Production external dependencies fail closed | README explicitly states fail-closed production integration posture | **Documented** | Automated fail-closed regression suite + live dependency outage tests |
| EOS-12 | Deployment | Deployment-specific configuration is separated from reusable platform capability | Canonical architecture defines controlled implementation model | **Architecture-defined** | Deployment manifest/config boundary + no-fork reuse test |
| EOS-13 | TRL | Engineering, field, regulatory, operational and production evidence are separated | Architecture explicitly requires separate maturity evidence | **Control adopted** | TRL evidence pack with objective acceptance gates |
| EOS-14 | Shakti | Full lifecycle assurance governs capability changes | Architecture defines Shakti lifecycle | **Control adopted** | Lifecycle gate records linked to implementation, test and field evidence |

## Immediate engineering priority order

1. **Data authority and tenant isolation** — establish the authoritative live database, schema/migration truth and verified tenant boundary.
2. **Evidence-to-MRV lineage** — prove that a material result can be traced back to immutable/controlled source evidence and reproduced.
3. **Physical measurement acceptance** — complete the real weighbridge/measurement path and prove authenticity, reconciliation and fail-closed behaviour.
4. **Registry/integrity acceptance** — complete real Hedera HCS and asymmetric VC verification rather than relying on configuration or mocked paths.
5. **Production infrastructure acceptance** — verify Cloud Run, Secret Manager, Redis and external dependency behaviour in the live deployment.
6. **AI assurance** — inventory actual AI features and attach model/version, uncertainty, human-review and adversarial controls.
7. **Connector governance** — establish a reusable integration contract/register so new ecosystem connectors do not create uncontrolled data paths.

## Status semantics

- **Architecture-defined:** the requirement is formally defined but implementation/acceptance evidence is not yet sufficient to claim completion.
- **Documented:** repository documentation provides evidence of the control, but live acceptance may still be required.
- **Control required:** the requirement is recognised and must be proven through repository/infrastructure evidence.
- **Acceptance-gated:** implementation may exist, but an external/live acceptance gate remains.
- **Verified:** only use after reproducible evidence is attached and independently reviewable.
- **Production:** only use after production acceptance and operational evidence are complete.

## Golden rule

**No architecture row becomes “Verified” or “Production” from documentation alone.**

The matrix is a living Shakti assurance register and must be updated whenever implementation, regulatory scope, field evidence, infrastructure or acceptance status changes.
