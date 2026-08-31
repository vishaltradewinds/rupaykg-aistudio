# BM WA03.001 & BM-T-011 Reconciliation

## 1. Official Sources
- **BM WA03.001**: Landfill methane recovery under the BEE CCTS Offset Mechanism.
- **BM-T-011**: Emissions from solid waste disposal sites, BEE CCTS Methodological Tool, Version 1.0, published 27 March 2025.
- Official BEE methodology/tool index: https://beeindia.gov.in/view_content.php?lang=1&lid=571
- Official BM-T-011 PDF: https://beeindia.gov.in/sites/default/files/BM-T-011_V1.pdf

BEE's current Offset Mechanism index lists BM WA03.001 as an approved methodology and BM-T-011 as an approved tool. The tool must therefore be treated as the authoritative methodological reference for this adapter. 

## 2. Formula Reconciliation

### BM-T-011
- **Method**: First Order Decay (FOD) historical-cohort summation.
- **Software boundary**: Each waste cohort is calculated independently using its waste mass, DOC fraction, cohort-specific decay rate and age; the methane result is then converted through DOCf, MCF, methane fraction, 16/12, model correction factor, methane capture adjustment where applicable, GWP and oxidation treatment.
- **Implemented parameters**: `W_j_x`, `DOC_j`, `k_j`, `assessmentYear`, `startYear`, `GWP_CH4`, `OX`, `F`, `DOCf`, `MCF`, `phi_y`, `f_y`.
- **Implemented controls**: explicit validation of monitored/methodology inputs, historical cohort trace, deterministic calculation hash, correction-factor/capture-factor validation.
- **Current implementation status**: COMPUTATIONALLY_IMPLEMENTED.
- **Regulatory reconciliation status**: AMBER / NOT_YET_MATCHED.
- **Reason**: The software now contains the historical FOD engine and the `phi_y` / `f_y` correction boundaries, but no authoritative BEE numerical reference fixture has yet been captured and independently reconciled end-to-end. Therefore the software must not be labelled regulatory-equivalent solely from unit tests.

### BM WA03.001
- **Formula**: `ERy = ((F_CH4_PJ_y - F_CH4_BL_y) * GWP_CH4 * (1 - OX)) - PE_y - LE_y`.
- **Parameters**: `F_CH4_PJ_y`, `F_CH4_BL_y`, `GWP_CH4`, `OX`, `PE_y`, `LE_y`.
- **Match Status**: PARTIAL_MATCH.
- **Remaining work**: detailed sub-equations for electricity pathway, flaring pathway, methane density calculations based on temperature/pressure, and project/leakage emission sub-tools.

## 3. Unit Audit
- `GWP_CH4`: tCO2e/tCH4
- `OX`, `DOCf`, `MCF`, `F`, `phi_y`, `f_y`: fractions
- `k_j`: 1/yr
- `W_j_x`: tonnes
- `F_CH4_PJ_y`, `F_CH4_BL_y`: tonnes CH4
- `PE_y`, `LE_y`: tCO2e

**Unit status:** MATCH on the implemented computational boundary; regulatory equivalence remains AMBER pending authoritative numerical reconciliation.

## 4. Verification Evidence
- Production Audit #128 passed after the `phi_y` / `f_y` implementation.
- The BM-T-011 engine has deterministic multi-year cohort tests and explicit factor validation.
- CI success proves software integrity, not BEE regulatory acceptance.

## 5. Conclusion

**BM-T-011:** COMPUTATIONALLY_IMPLEMENTED / REGULATORY_RECONCILIATION_AMBER.

**BM WA03.001:** PARTIAL_MATCH.

The next gate is an authoritative numerical BM-T-011 reconciliation using a BEE-published/reference case or an independently verified worked example. Until that evidence exists, RupayKg must remain conditionally verified for this methodology boundary.
