# BM WA03.001 — Mathematical Reconciliation Status

**Status: AMBER — synthetic arithmetic example only; authoritative methodology reconciliation is not established.**

## Scope
This document records a software arithmetic example, not an independently verified BEE reference calculation. The values below are illustrative and must not be used to substantiate regulatory equivalence, project eligibility, or credit issuance.

## Example arithmetic (non-authoritative)
Illustrative inputs:
- Project methane captured/destroyed: 1,000 tCH4/year
- Baseline methane: 150 tCH4/year
- Illustrative GWP: 28 tCO2e/tCH4
- Illustrative oxidation factor: 0.10
- Illustrative project emissions: 14 tCO2e/year
- Illustrative leakage emissions: 0 tCO2e/year

Arithmetic:
- Net methane: 1,000 - 150 = 850 tCH4/year
- Illustrative gross amount: 850 × 28 = 23,800 tCO2e/year
- After illustrative oxidation adjustment: 23,800 × (1 - 0.10) = 21,420 tCO2e/year
- Illustrative net amount: 21,420 - 14 - 0 = 21,406 tCO2e/year

This only verifies arithmetic under the stated assumptions. It does not prove the assumptions, boundaries, equations, parameter choices or units conform to the currently applicable BEE BM WA03.001 methodology.

## Material evidence conflicts requiring resolution
1. The repository's BM-T-011 BEE Reference Evidence Register records GWP_CH4 = 29.8 tCO2e/tCH4 from IPCC AR6 for the described BM-T-011 use case, while this older example used 28 from AR5. The applicable value must be selected from the exact methodology/tool version and use case, not by preference or hard-coded global default.
2. The BEE reference register states BM WA03.001's use of BM-T-011 for BE_CH4,SWDS,y specifies f = 0.0 in that use case because captured/destructed landfill gas is already accounted for. The project-specific calculation must preserve that boundary and must not double-count captured methane.
3. The previous title and conclusion described the example as a "golden test fixture", "independent reconciliation", and "100% mathematically verified & reproducible." Those claims exceeded the available evidence and are withdrawn by this revision.
4. The repository's BM-T-011 reference evidence register explicitly states that a complete authoritative numerical worked case was not located in the reviewed public sources and that end-to-end numerical equivalence is not proven.

## Required closure evidence
- Pin the exact BEE methodology/tool version and applicability to the project.
- Archive the authoritative source and its hash, publication/version details, retrieval date and relevant page/equation.
- Independently verify all inputs, units, project/baseline boundaries and parameter-selection procedures.
- Obtain or independently derive a reference case with documented provenance, intermediate values and final output; label synthetic vectors as NON_AUTHORITATIVE_TEST_VECTOR.
- Reconcile implementation output at intermediate and final stages with documented tolerances.
- Obtain independent technical review and preserve reviewer/date/evidence references.

## Release rule
Until these gates pass, status remains **AMBER**. Passing a unit test confirms only the tested software behaviour; it does not establish regulatory equivalence or credit issuance eligibility.
