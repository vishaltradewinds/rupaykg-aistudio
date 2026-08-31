# BM-T-011 BEE Reference Evidence Register

## Purpose

This register defines the evidence gate required before BM-T-011 can be classified as regulatory-equivalent in RupayKg Enterprise 3.0.

## Authoritative sources verified

1. BEE Methodological Tool **BM-T-011: Emissions from solid waste disposal sites**, Version 1.0, publication date 27 March 2025.
   - https://beeindia.gov.in/sites/default/files/BM-T-011_V1.pdf
2. BEE Offset Mechanism methodology/tool index, last updated 7 July 2026.
   - https://beeindia.gov.in/view_content.php?lang=1&lid=571
3. BEE landfill methane recovery methodology **BM WA03.001**, Version 1.0, publication date 27 March 2025.
   - The methodology explicitly requires BM-T-011 for `BE_CH4,SWDS,y`.
   - It explicitly specifies **`f = 0.0`** in this use case because captured/destructed LFG is already accounted for in the methodology.
   - It explicitly defines `x` as beginning with the first year the SWDS receives waste and continuing through year `y`.
   - It gives a default oxidation factor `OX = 0.1` for the applicable baseline calculation.
   - It specifies `GWP_CH4 = 29.8 tCO2e/tCH4` from IPCC AR6, subject to future updates with later IPCC assessments.

## Evidence status

- Official BM-T-011 source located: **YES**
- Official approval/index status verified: **YES**
- Official BM WA03.001 cross-reference to BM-T-011 verified: **YES**
- Historical FOD equation implemented: **YES**
- `phi_y` correction-factor boundary implemented: **YES**
- `f_y` capture-factor boundary implemented: **YES**
- Official parameter tables independently extracted: **YES**
- BEE-published numerical worked/reference case containing the complete BM-T-011 input/output chain located in the public sources reviewed: **NO**
- End-to-end numerical equivalence proven: **NO**

## Official parameter evidence extracted

From BM-T-011 Version 1.0:

- `OX` default for Application A: **0.1**.
- `F` default for Application A: **0.5**.
- `DOCf,default`: **0.5** for the permitted default use cases described by the tool.
- `MCF` is selected according to the SWDS type; Application A provides type-specific defaults rather than one universal value.
- `phi_y` is determined through the tool's model-correction procedure; the applicable value depends on the application and prescribed procedure. It must not be hard-coded as an arbitrary fraction.
- `f_y` is estimated once for Application A or monitored for Application B, according to the tool's parameter-determination table.
- `W_j,x`, `DOC_j`, and `k_j` are determined according to the waste-type and application-specific procedures in the tool.

These are **source-derived constraints**, not a substitute for a project-specific numerical reference case.

## Formula conformance

BM-T-011 yearly Equation (1) requires the historical FOD sum over waste cohorts and waste types, followed by the factors:

`phi_y × (1 - f_y) × GWP_CH4 × (1 - OX) × 16/12 × F × DOCf,y × MCF_y × FOD_sum`

The RupayKg engine implements this computational boundary and preserves a deterministic cohort trace and calculation hash.

## Required reference fixture

A fixture may be promoted to `AUTHORITATIVE_REFERENCE` only when all of the following are available from an authoritative or independently verified source:

- waste cohorts `W_j,x`
- waste-type DOC values `DOC_j`
- decay constants `k_j`
- assessment year `y`
- `DOCf`, `MCF`, `F`, `OX`, `GWP_CH4`
- applicable `phi_y`
- applicable `f_y`
- expected intermediate FOD sum / methane result
- expected final `BE_CH4,SWDS,y` result
- source document/page or independently verified calculation provenance

## Current external-search result

The official public BEE material reviewed contains the equation, parameter definitions, parameter-selection procedures and default parameter tables, but does **not expose a complete numerical worked case containing all waste cohorts, intermediate FOD values and final `BE_CH4,SWDS,y` output**.

Therefore RupayKg will not manufacture or label a synthetic calculation as a BEE golden value.

A synthetic conformance vector may be used for software testing, but it must remain explicitly labelled `NON_AUTHORITATIVE_TEST_VECTOR`.

## Verification rule

A passing unit test or Production Audit demonstrates software integrity only. It does not establish regulatory equivalence. Regulatory status remains **AMBER** until a reference fixture is independently reconciled at intermediate and final calculation levels.
