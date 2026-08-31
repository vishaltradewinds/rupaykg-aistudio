# BM WA03.002 — Canonical Implementation Mapping

## Status

SOURCE_LOCKED / IMPLEMENTATION_MAPPED / NUMERICAL_RECONCILIATION_PENDING

This document is an implementation contract, not a claim of methodology reconciliation.

## Source

BEE approved methodology catalogue lists BM WA03.002 — Flaring or use of landfill gas under Waste Handling and Disposal. The repository must retain the exact BEE source/version used for implementation and its evidence hash.

## Canonical calculation pipeline

1. Eligibility and applicability gate
2. Project boundary and baseline scenario identification
3. Landfill-gas quantity/composition measurement inputs
4. Methane mass-flow determination using the applicable approved gaseous-stream tool
5. Project activity treatment: flaring and/or qualifying use of landfill gas
6. Applicable project emissions and leakage treatment
7. Applicable baseline displacement treatment
8. Net emission-reduction calculation
9. Deterministic intermediate trace
10. Evidence/provenance hash generation

## Required parameter classes

- landfill-gas flow/quantity
- methane concentration or mass fraction
- measurement basis and operating period
- flare/use operating data
- destruction/use efficiency parameters required by the BEE methodology
- applicable baseline fuel/electricity parameters
- applicable emission factors
- project/leakage energy and fuel inputs
- monitoring uncertainty/quality controls

No default value is permitted unless explicitly authorized by the locked BEE methodology/tool. Missing required evidence must fail closed.

## Tool dependencies

Where applicable, reuse the canonical implementations of:

- BM-T-001 baseline/additionality
- BM-T-002 fossil-fuel combustion emissions
- BM-T-003 electricity emissions/generation
- BM-T-004 project emissions from flaring
- BM-T-005 gaseous-stream mass flow
- BM-T-011 solid-waste-disposal-site emissions

Do not duplicate these tools inside the WA03.002 adapter.

## Urban / rural / mixed model

The equation layer remains identical. Context is represented through:

- facility/site identity
- landfill cell/source identity
- meter and instrument provenance
- operating-period evidence
- aggregation membership
- calibration/QA evidence
- source-to-result lineage

Rural or decentralized projects must remain decomposable to their underlying source records. Urban facilities must preserve facility/cell/meter lineage.

## Deterministic trace

Every calculation must emit:

`source_version → input_id → normalized_parameter → intermediate_value → equation_id → result → evidence_hash`

The same input snapshot and methodology version must produce the same numerical result.

## Acceptance gates

- [ ] Exact BEE source/version archived
- [ ] Equation mapping reviewed
- [ ] Parameter dictionary complete
- [ ] Urban/rural/mixed evidence tests pass
- [ ] Deterministic trace test passes
- [ ] Independent numerical reference case passes
- [ ] Intermediate reconciliation passes
- [ ] Final tCO2e reconciliation passes
- [ ] Regression/adversarial suite passes
- [ ] Evidence/source/calculation hashes archived
- [ ] ACVA review evidence available where required

## Explicit non-claim

CI success does not equal METHOD_RECONCILED. This adapter remains conditionally verified until independent numerical reconciliation is completed.
