# RupayKg Enterprise 3.0 — External Methodology Validation Package

## Objective

Prepare one repeatable evidence package for independent validation of every BEE-approved CCTS Offset Mechanism methodology used by RupayKg, across urban, rural and mixed project contexts.

## Package contents

For each methodology/project instance, the package must contain:

### 1. Regulatory source
- Official BEE methodology/tool PDF.
- Version and publication date.
- BEE catalogue status.
- Retrieval date and source hash.

### 2. Project applicability
- Project identifier.
- Geography and urban/rural/mixed context.
- Project boundary and physical assets.
- Applicable BEE methodology.
- Eligibility rationale.
- Baseline scenario.
- Additionality/eligibility evidence where required.
- Ownership/control and double-counting boundary.

### 3. Calculation specification
- Equation-by-equation mapping to RupayKg.
- Parameter dictionary.
- Units and conversions.
- Default vs measured vs monitored parameters.
- Uncertainty/model-correction treatment.
- Intermediate calculation trace.
- Final result.
- Deterministic calculation hash.

### 4. Monitoring evidence
- Measurement source.
- Instrument/device identifier where applicable.
- Calibration/verification evidence.
- Sampling frequency.
- Data-quality checks.
- Missing-data treatment.
- Responsible party.
- Evidence retention period.

### 5. Independent reconciliation

The validator should receive a complete worked case and compare:

1. Raw project inputs.
2. Normalized inputs.
3. Each methodology parameter.
4. Each intermediate equation result.
5. Baseline/project-emission components where applicable.
6. Final emission reduction/removal/avoidance quantity.
7. Rounding and unit conversions.
8. Final tCO2e result.

No final-number-only reconciliation is sufficient.

## Methodology-specific evidence tracks

### BM EN01.001 — Renewable grid electricity
Evidence focus: generation metering, grid connection, renewable technology, baseline grid-emission treatment, electricity export/consumption boundary, meter calibration and temporal alignment.

### BM EN01.002 — Electrolytic hydrogen
Evidence focus: renewable electricity source, electrolyser boundary, hydrogen production, energy metering, operating hours, electricity attribute/claim boundary and baseline fossil/alternative hydrogen treatment as prescribed by the methodology.

### BM IN02.001 — Industrial energy efficiency/fuel switching
Evidence focus: facility boundary, baseline energy use, project energy use, fuel quantities, calorific values, meter calibration, production normalization and fuel-switch emission factors.

### BM IN02.002 — Hydrogen from methane extracted from biogas
Evidence focus: biogas source, methane recovery, methane quality/flow, hydrogen production, energy consumption, utilization/destruction boundary and baseline treatment.

### BM WA03.001 — Landfill methane recovery
Evidence focus: landfill waste cohorts, waste characterization, DOC, k, MCF, DOCf, F, OX, GWP, phi, f, landfill-year indexing, gas recovery/destruction boundary and historical FOD trace.

### BM WA03.002 — Landfill gas flaring/use
Evidence focus: landfill gas quantity and composition, capture, destruction/utilization, flare/meter evidence, operating periods, methane oxidation/capture boundary and avoided emissions calculation prescribed by the methodology.

### BM AG04.001 — Livestock/manure methane recovery
Evidence focus: household/small-farm population, livestock and manure quantities, manure-management baseline, recovery system, methane measurement/calculation, biogas use/destruction and decentralized aggregation controls.

### BM FR05.001 — Mangrove afforestation/reforestation
Evidence focus: eligible degraded mangrove boundary, land tenure/control, baseline land condition, area/remote-sensing evidence, biomass/carbon pools, permanence/non-permanence treatment, leakage and monitoring evidence as prescribed.

## Urban/rural deployment model

### Urban
Use centralized project IDs and asset IDs where available, but retain source-level provenance for municipal, industrial and utility systems. Aggregation must preserve facility/cell/meter-level traceability.

### Rural
Use household/farm/community/cluster IDs and preserve source-level evidence through aggregation. Every aggregated value must be decomposable to the underlying source population or measurement set.

### Mixed
A project may contain urban and rural sub-boundaries. RupayKg must maintain separate evidence lineage and eligibility assessments for each sub-boundary even when the same methodology engine is used.

## ACVA handoff

The external package is designed for review by an ACVA. BEE's current ACVA register (14 July 2026) lists final and provisional agencies and their accredited Offset Mechanism sectors. The verifier must be selected based on current accreditation status and the applicable project sector at the time of engagement.

## Acceptance criteria

A methodology is promoted to **METHOD_RECONCILED** only when:

- authoritative source/version is locked;
- eligibility is documented;
- equation mapping is complete;
- parameter provenance is complete;
- intermediate numerical reconciliation passes;
- final numerical reconciliation passes;
- evidence lineage is complete;
- automated regression tests pass;
- independent validation evidence is archived.

A methodology is **SOFTWARE_VERIFIED / EXTERNAL_VALIDATION_PENDING** when the code and tests pass but the independent numerical reference case has not yet been reconciled.

## Current platform strategy

RupayKg should maintain one canonical methodology execution layer with versioned adapters for each approved methodology. Urban/rural context belongs in project metadata, eligibility, monitoring and evidence lineage—not duplicated calculation engines.

## Official references

- BEE Methodologies and Tools under Offset Mechanism (updated 07 July 2026): https://beeindia.gov.in/view_content.php?lang=1&lid=571
- BEE Accredited Carbon Verification Agency register (updated 14 July 2026): https://beeindia.gov.in/view_content.php?lang=1&lid=568
- BEE Detailed Procedure for Offset Mechanism: https://beeindia.gov.in/sites/default/files/Detailed%20Procedure%20for%20Offset%20Mechanism_CCTS.pdf
