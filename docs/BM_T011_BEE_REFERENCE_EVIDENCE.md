# BM-T-011 BEE Reference Evidence Register

## Purpose

This register defines the evidence gate required before BM-T-011 can be classified as regulatory-equivalent in RupayKg Enterprise 3.0.

## Authoritative sources verified

1. BEE Methodological Tool **BM-T-011: Emissions from solid waste disposal sites**, Version 1.0, publication date 27 March 2025.
   - https://beeindia.gov.in/sites/default/files/BM-T-011_V1.pdf
2. BEE Offset Mechanism methodology/tool index.
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
- BEE-published numerical worked/reference case containing the complete BM-T-011 input/output chain located in the public sources reviewed: **NO**
- End-to-end numerical equivalence proven: **NO**

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

Until those fields are populated from a defensible reference case, no test fixture in this repository may be described as a BEE-authoritative golden value.

## Verification rule

A passing unit test or Production Audit demonstrates software integrity only. It does not establish regulatory equivalence. Regulatory status remains **AMBER** until the reference fixture is independently reconciled at intermediate and final calculation levels.
