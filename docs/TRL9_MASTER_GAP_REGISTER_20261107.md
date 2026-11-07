# RupayKg TRL 9 Master Gap Register — 2026-11-07

## Purpose

This is the controlling engineering-assurance gap register for RupayKg. It separates repository engineering state from deployment, field, regulatory, verification and certification evidence.

## Authoritative baseline

- Repository: `vishaltradewinds/rupaykg-aistudio`
- Baseline branch: `main`
- Baseline commit: `c2380d6e0a8628588959cac43ff7a519acc0c07a`
- Baseline commit date: 2026-09-15
- Rule: branch-only work is not part of the production baseline until merged and independently validated.

## Current gate

**Overall platform TRL: NOT ASSESSED FOR TRL 9**

Engineering maturity is materially advanced, but TRL 9 requires evidence across the complete operational system, not software completeness alone.

## Master gaps

| ID | Gate | Current evidence | Required closure evidence | Status |
|---|---|---|---|---|
| G-001 | Authoritative baseline | main is identifiable | Freeze repo + deployed revision + DB identity as one release baseline | OPEN |
| G-002 | Database authority | Neon primary branch concretely identified; 1 database, 67 public tables, 92 applied migrations | Prove repository↔DB migration parity, runtime DB target, RLS/tenant isolation and non-bypass application access controls | **BLOCKING / OPEN** |
| G-003 | Production deployment | Vercel checks are green for recorded main commit | Verify live Cloud Run/container revision, env/secrets, health, rollback and runtime acceptance | OPEN |
| G-004 | BM-T-011 | Engine/tests exist | Independent authoritative numerical reconciliation fixture and signed evidence | OPEN |
| G-005 | BM-WA03.001 | Canonical adapter integrated | Complete methodology reconciliation, boundary conditions and authoritative reference evidence | OPEN |
| G-006 | BM-WA03.002 | Engine/mapping tests exist | Complete regulatory mapping/evidence acceptance and live workflow validation | OPEN |
| G-007 | BM-WA03.003 | Adapter/interface status only | Complete deterministic implementation, tests and methodology evidence | OPEN |
| G-008 | MRV evidence chain | MRV/evidence architecture exists | Demonstrate immutable source-to-measurement-to-calculation lineage on real pilot data | OPEN |
| G-009 | Physical measurement | Hardware-anchor architecture documented | Instrument-specific interface, calibration, provenance and field acceptance evidence | OPEN |
| G-010 | Weighbridge | Interface boundary identified | Real device connectivity, calibration evidence, ingestion, failure/replay tests | OPEN |
| G-011 | Hedera HCS | Integration boundary exists | Real write + consensus/read-back + persistence evidence in authorized environment | OPEN |
| G-012 | W3C VC | Integration boundary exists | Real asymmetric signing, verification and tamper-rejection evidence | OPEN |
| G-013 | Double counting | Control architecture exists | End-to-end invariant tests against real project/claim lifecycle | OPEN |
| G-014 | Registry boundary | Authoritative adapter is canonical; legacy paths quarantined | Verify configured external registry behavior with real authorized credentials where required | OPEN |
| G-015 | Pilot operation | Jabalpur SITE-JBP-01 is the target field baseline | Continuous real-site operation with complete evidence package | OPEN |
| G-016 | Regulatory acceptance | Regulatory mappings documented | Authority/validator acceptance where legally required; no internal documentation treated as certification | OPEN |
| G-017 | ICVCM CCP | PR #16 contains control register | Merge only after CI/review; treat CCP as complementary benchmark, not Indian statutory equivalence | OPEN |
| G-018 | Component TRL | PR #16 adds evidence register | Validate each component evidence item and then derive system-level TRL | OPEN |
| G-019 | Hardware compliance | PR #15 documents applicability gates | Verify actual device origin, MeitY/STQC/BIS/WPC applicability, calibration and procurement evidence | OPEN |
| G-020 | Shakti governance | PR #18 adds governance/lifecycle documentation | Merge and implement applicable controls; evidence implementation rather than documentation-only conformance | OPEN |
| G-021 | Security assurance | Security/regression suites exist | Execute current full suites on release candidate and preserve signed artifacts | OPEN |
| G-022 | Operational resilience | Fail-closed and persistence tests exist | Prove backup/restore, restart survival, offline/replay behavior and incident recovery in deployed environment | OPEN |
| G-023 | Independent assurance | Internal engineering evidence exists | Independent validation/verification of relevant carbon claims and field evidence | OPEN |
| G-024 | Production certification | No platform-wide certification established | Formal release gate showing all mandatory engineering + operational + regulatory evidence closed | OPEN |

## Live database evidence — 2026-11-07

Read-only Neon inspection of project `rupaykg-production-fresh` (`steep-mud-79906940`), primary branch `main` (`br-restless-base-b44cip2h`), database `rupaykg`:

- One PostgreSQL database is present on the primary branch.
- 67 public tables are present.
- `schema_migrations` contains 92 applied migrations, through version `20261021`.
- 0 public PostgreSQL RLS policies are present.
- All 67 inspected public tables report `rls_enabled = false` and `rls_forced = false`.
- The `rupaykg` database role reports `rolbypassrls = true`, plus role-creation/database-creation privileges.
- Multiple rehearsal/lab Neon branches exist, but they are not treated as production authority.

This evidence is recorded in `docs/RUPAYKG_LIVE_DATABASE_AUTHORITY_AUDIT_20261107.md`.

**Implication:** the candidate authoritative DB is identified, but tenant isolation is not yet demonstrated. G-002 is therefore a blocking open gate. No production DB mutation was performed in this audit.

## Branch-only work requiring controlled disposition

### PR #16 — TRL + ICVCM
- 9 commits ahead of main.
- Adds component TRL evidence register and ICVCM CCP controls.
- Explicitly does not establish platform-wide TRL 9.
- Must not be treated as merged production state.

### PR #15 — Hardware anchor
- 6 commits ahead of main.
- Documentation architecture only.
- Must not be treated as physical hardware validation.

### PR #18 — Shakti governance
- 2 commits ahead of main.
- Documentation-only governance/lifecycle foundation.
- Must not be treated as implemented runtime control.

## TRL 9 release sequence

1. Freeze authoritative repository/deployment/database baseline.
2. Reconcile production DB schema, migrations and tenant isolation.
3. Produce release-candidate CI/security/regression evidence.
4. Verify deployed runtime and rollback path.
5. Close deterministic methodology and regulatory-reference gaps.
6. Close real measurement/calibration/weighbridge evidence.
7. Close real Hedera and VC cryptographic runtime evidence.
8. Execute SITE-JBP-01 end-to-end evidence lineage.
9. Operate the system continuously under defined acceptance criteria.
10. Obtain required independent validation/verification.
11. Compile component TRL evidence.
12. Derive system-level TRL only from demonstrated evidence.
13. Run final Shakti lifecycle/compliance gate.
14. Issue production certification only if every mandatory gate is closed.

## Non-negotiable evidence rule

A documented architecture, mock, placeholder, configured credential, passing unit test, or successful build does **not** constitute live operational, regulatory, field or certification evidence.

## Current decision

**RupayKg remains in advanced engineering / pre-TRL-9 assurance.**

No TRL 9, regulatory certification, field certification or production certification claim is authorized until the corresponding evidence gates are closed.
