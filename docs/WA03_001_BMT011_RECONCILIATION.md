# BM WA03.001 & BM-T-011 Reconciliation

## 1. Official Sources
- **BM WA03.001**: Landfill Methane Recovery (BEE CCTS)
- **BM-T-011**: Emissions from solid waste disposal sites (BEE CCTS Tool)

## 2. Formula Reconciliation

### BM-T-011
- **Formula**: Methane avoided via First Order Decay (FOD)
- **Software Equation**: `BE_CH4_SWDS_y = 1 * (1 - 0) * GWP_CH4 * (1 - OX) * (16/12) * F * DOCf * MCF * methane_gen`
- **Parameters**: W_j_x, DOC_j, k_j, year, startYear, GWP_CH4, OX, F, DOCf, MCF.
- **Match Status**: PARTIAL_MATCH. 
- **Notes**: The current implementation uses a simplified exponential decay `methane_gen = W_j_x * DOC_j * Math.exp(-k_j * t) * (1 - Math.exp(-k_j))` for demonstration. A full production implementation requires multi-year summation over historical waste types and exact handling of delay factors (e.g., $e^{-k_j(y-x)}$ and model correction factor). Needs precise alignment with official BEE formula before PRODUCTION_READY.

### BM WA03.001
- **Formula**: Emission Reductions (ERy)
- **Software Equation**: `ERy = ((F_CH4_PJ_y - F_CH4_BL_y) * GWP_CH4 * (1 - OX)) - PE_y - LE_y`
- **Parameters**: F_CH4_PJ_y, F_CH4_BL_y, GWP_CH4, OX, PE_y, LE_y.
- **Match Status**: PARTIAL_MATCH.
- **Notes**: Represents the high-level ERy equation. Missing the detailed sub-equations for electricity pathway, flaring pathway, methane density calculations based on temperature/pressure, and project emission sub-tools. Needs comprehensive sub-parameter inputs to be marked MATCH.

## 3. Unit Audit
- **GWP_CH4**: tCO2e/tCH4 (29.8)
- **OX, DOCf, MCF, F**: fractions
- **k_j**: 1/yr
- **W_j_x**: tonnes
- **F_CH4_PJ_y, F_CH4_BL_y**: tonnes of CH4
- **PE_y, LE_y**: tCO2e
- **Match Status**: MATCH on core units, but missing strict enforcement adapters in code.

## 4. Conclusion
Current implementation is ADAPTER_READY. Not PRODUCTION_READY. Strict physical evidence and sub-equations must be added.
