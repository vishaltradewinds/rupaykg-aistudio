# Shakti Standards — TRL + ICVCM Source Audit Findings (Batch A)
Audit date: 2026-10-27
Status: Static source review in progress; runtime and deployment evidence not independently reproduced.
Scope: Source and tests fetched from repository default branch at baseline commit c2380d6e0a8628588959cac43ff7a519acc0c07a, plus corrections committed on this audit branch. Confirm exact commit before treating any finding as current.

## Executive decision
The repository has real methodology engines, test scripts, source registries, credential/anchor adapters and extensive compliance documentation. This supports a claim of substantial engineering implementation, not a platform-wide TRL score, regulatory equivalence, ICVCM approval, or production certification.

Critical finding: a document previously claimed a BM WA03.001 example was an independent, fully reconciled BEE golden fixture and "100% mathematically verified." The input values were illustrative, and the repo's BM-T-011 reference register explicitly says an authoritative complete numerical worked case was not located and end-to-end numerical equivalence was not proven. The claim has been withdrawn in this branch and replaced with an AMBER/non-authoritative arithmetic example.

## Findings

### F-TRL-001 — Overall platform TRL cannot yet be defensibly scored
Severity: HIGH (release/claims control)
Evidence: Software/tests and pilot-readiness artefacts exist, but source tree and documents alone do not prove real-world operational validation across application, methodology engines, MRV hardware, identity, registry anchoring and site operations.
Required action: Keep platform TRL NOT ASSESSED; score components individually only after evidence is collected under an explicitly selected TRL framework.

### F-MTH-001 — WA03.001 reconciliation claim exceeded evidence
Severity: CRITICAL (carbon claim integrity)
Evidence: docs/BM_WA03_001_MATHEMATICAL_RECONCILIATION.md used an illustrative calculation (1,000 - 150 tCH4, GWP 28, oxidation 0.10, project emissions 14) and labelled it "golden" and independently verified. docs/BM_T011_BEE_REFERENCE_EVIDENCE.md says the reviewed public BEE sources did not provide a complete numerical reference chain and explicitly says end-to-end equivalence is not proven.
Action taken: Corrected on this branch. The calculation is now clearly non-authoritative and AMBER. It must not be treated as an official reference fixture.

### F-MTH-002 — GWP and methane boundary require methodology-version pinning
Severity: HIGH
Evidence: BM-T-011 evidence register says GWP_CH4 = 29.8 tCO2e/tCH4 for the specified BM-T-011 use case (IPCC AR6), while the old WA03.001 example used 28 (AR5). The same register says BM WA03.001's specified BM-T-011 use case sets f = 0.0 because captured/destructed LFG is already accounted for.
Required action: Do not apply one global GWP or capture fraction to every methodology. Bind the exact methodology/tool version, applicability and parameter-selection rule to each calculation. Add tests proving no double-counting of capture and preventing stale-version calculations.

### F-MTH-003 — WA03.002 engine tests are self-consistency tests, not independent methodology proof
Severity: HIGH
Evidence: tests/wa03_002_engine_test.ts computes expected methane emissions using the same high-level formula as the implementation and checks arithmetic consistency. docs/BM_WA03_002_IMPLEMENTATION_MAPPING.md explicitly says NUMERICAL_RECONCILIATION_PENDING.
Required action: Add independently derived reference fixtures with provenance and intermediate values. Keep methodology status AMBER until independent reconciliation.

### F-MTH-004 — WA03.003 test coverage does not establish full methodology conformance
Severity: HIGH
Evidence: tests/wa03_003_engine_test.ts checks a simple biogas conversion and subtraction result. This is useful unit coverage but not proof that all official methodology equations, eligibility, baseline, leakage, monitoring and uncertainty rules are implemented.
Required action: Map every applicable official equation and parameter to code/tests; document out-of-scope pathways; independently reconcile reference cases.

### F-ICVCM-001 — CCP controls are currently an audit target, not proven implemented end-to-end
Severity: HIGH
Evidence: This batch added a CCP control register. Presence of documentation is not evidence that workflows, schemas, APIs, permissions, reports and tests enforce each control.
Required action: Trace each of ten CCPs to existing source/schema/API/test and evidence object. For missing controls, implement in isolated, tested batches. AI output must not approve itself or substitute for an independent verifier.

### F-REG-001 — External registry status must be distinguished from actual consensus proof
Severity: HIGH
Evidence: src/services/hederaAnchor.ts explicitly distinguishes configured credentials, write availability and consensus confirmation; its status function reports consensus as CONFIGURED when credentials exist. Configuration is not a transaction receipt or consensus proof.
Required action: UI and claims must label this state "configured/pending proof", not "anchored/confirmed". A successful anchor requires persisted transaction ID, consensus timestamp/receipt, mirror-node read-back and idempotency verification.

### F-ID-001 — Verifiable credential assurance requires cryptographic and key-management evidence
Severity: HIGH
Evidence: src/services/credentialService.ts includes fail-closed checks for issuer private key and issuer DID. Configuration guards alone do not prove W3C Data Integrity/VC interoperability, key rotation, revocation/status handling or independent signature verification.
Required action: Verify actual signing suite, canonicalization, signature verification, key custody/rotation, issuer authorization, credential status/revocation and negative tests before claiming production-grade VC support.

### F-TEST-001 — Static inspection is not a completed test run
Severity: MEDIUM
Evidence: package.json defines test, lint/build and specialized regression scripts; current PR check snapshot showed Vercel checks successful, RBAC Contract successful, and RupayKg Production Audit in progress at the time observed.
Required action: Capture final results and exact commit for lint, build, full test, P0/P1/P2 suites, consolidation checks and production audit. Do not infer success from workflow names or prior runs.

## Required control design
Every carbon calculation should bind: project/activity boundary; official source and version; applicability decision; normalized inputs and units; instrument/evidence provenance; parameter derivation; equation IDs; intermediate trace; uncertainty/QA flags; calculation hash; reviewer decision; and downstream registry/claim status. Any missing mandatory input, unknown version, failed reconciliation or unresolved duplicate should block issuance-ready state.

Every ICVCM control should bind: framework version and source hash; applicability rationale; owner; evidence references; test references; status; exceptions; independent reviewer; review date; next review date. Do not label RupayKg or its projects CCP-approved unless official ICVCM status establishes the relevant eligible program and approved methodology.

## Next batch plan
1. Inspect method engine call sites and confirm required inputs cannot silently fall back to defaults for production.
2. Audit ICVCM coverage against database schema, API routes, role permissions, UI claims and tests.
3. Add negative tests for missing methodology version, unknown applicability, missing evidence, duplicate/overlap conflicts and unsupported public claims.
4. Run the existing test/build/security suite on the exact PR head and preserve logs.
5. Close each finding only with a commit, test evidence and reviewer record.
