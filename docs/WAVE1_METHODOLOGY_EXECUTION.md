# RupayKg Enterprise 3.0 — Wave 1 Methodology Execution

## Scope

Wave 1 covers the five BEE-approved methodologies currently in the RupayKg CCTS validation scope:

1. BM WA03.001 — Landfill methane recovery
2. BM WA03.002 — Flaring or use of landfill gas
3. BM WA03.003 — Production of Compressed Bio-gas (CBG)
4. BM IN02.002 — Hydrogen production using methane extracted from biogas
5. BM AG04.001 — Methane recovery from livestock and manure management at households and small farms

BEE's current methodology catalogue was checked 07 July 2026 and lists these methodologies as approved under the Offset Mechanism.

## Execution contract

Each methodology must pass these gates before being marked METHOD_RECONCILED:

- [ ] Exact official BEE source/version locked
- [ ] Applicability and project boundary mapped
- [ ] Equation-by-equation canonical engine mapping
- [ ] Parameter dictionary with units and provenance
- [ ] Monitoring/data-quality requirements captured
- [ ] Urban/rural/mixed evidence model defined without duplicate formulas
- [ ] Deterministic intermediate calculation trace
- [ ] Independently verifiable numerical reference case
- [ ] Intermediate reconciliation
- [ ] Final tCO2e reconciliation
- [ ] Regression/adversarial tests
- [ ] Evidence/source/calculation hashes archived
- [ ] Appropriate ACVA review evidence

## Methodology tracks

### WA03.001 — Landfill methane recovery
Status: SOFTWARE_VERIFIED / EXTERNAL_VALIDATION_PENDING
Existing FOD implementation is retained. External reconciliation remains mandatory.

### WA03.002 — Flaring or use of landfill gas
Status: NOT_IMPLEMENTED
Required work: source lock, eligibility, gas capture/destruction/use boundary, measurement equations, parameter provenance, intermediate trace, reconciliation fixture and regression suite.

### WA03.003 — Production of CBG
Status: NOT_IMPLEMENTED
Required work: source lock, feedstock/biogas boundary, methane and CBG production measurements, energy/consumption boundaries, baseline/project treatment, trace and reconciliation fixture.

### IN02.002 — Hydrogen from methane extracted from biogas
Status: NOT_IMPLEMENTED
Required work: biogas source boundary, methane extraction, hydrogen production, energy consumption, baseline treatment, parameter provenance, trace and reconciliation fixture.

### AG04.001 — Livestock/manure methane recovery
Status: NOT_IMPLEMENTED
Required work: household/small-farm eligibility, livestock/manure quantities, baseline manure management, methane recovery system, decentralized aggregation controls, monitoring and reconciliation fixture.

## Context model

Urban, rural and mixed projects use the same canonical methodology engine. Context is represented through project boundary, eligibility, monitoring, aggregation and evidence lineage.

Rural aggregation must remain decomposable to source households/farms/communities. Urban aggregation must retain facility/cell/meter provenance.

## Acceptance rule

Passing CI alone does not promote a methodology to METHOD_RECONCILED. Independent numerical reconciliation and evidence archival are required.

## Immediate order

WA03.001 reconciliation harness → WA03.002 mapping → WA03.003 mapping → IN02.002 mapping → AG04.001 mapping → Wave 1 regression audit → independent reconciliation package.

## Authoritative references

- BEE Methodologies and Tools under Offset Mechanism: https://beeindia.gov.in/view_content.php?lang=1&lid=571
- BEE ACVA register: https://beeindia.gov.in/view_content.php?lang=1&lid=568
- BEE Detailed Procedure for Offset Mechanism: https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf
