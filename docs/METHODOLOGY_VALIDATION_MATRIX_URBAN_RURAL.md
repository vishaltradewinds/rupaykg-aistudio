# RupayKg Enterprise 3.0 — Methodology Validation Matrix

## Purpose

This document establishes the platform-wide validation boundary for all methodologies/tools currently listed by the Bureau of Energy Efficiency (BEE) under the CCTS Offset Mechanism. RupayKg is designed for both urban and rural project contexts, but **urban/rural is a deployment context, not a substitute for methodology eligibility**.

Authoritative BEE catalogue checked: 07 July 2026.

## Current BEE-approved methodology set

| ID | Sector | Methodology | RupayKg domain | Urban context | Rural context | Validation status |
|---|---|---|---|---|---|---|
| BM EN01.001 | Energy | Grid-connected electricity generation from renewable sources | Renewable energy / grid projects | Applicable where project eligibility is met | Applicable where project eligibility is met | Methodology-specific evidence required |
| BM EN01.002 | Energy | Hydrogen production from electrolysis of water | Renewable hydrogen | Applicable where project eligibility is met | Applicable where project eligibility is met | Methodology-specific evidence required |
| BM IN02.001 | Industries | Energy efficiency and fuel switching measures for industrial facilities | Industrial decarbonisation | Applicable to qualifying facilities | Applicable to qualifying facilities | Methodology-specific evidence required |
| BM IN02.002 | Industries | Hydrogen production using methane extracted from biogas | Biogas / industrial hydrogen | Applicable where project eligibility is met | Applicable where project eligibility is met | Methodology-specific evidence required |
| BM WA03.001 | Waste Handling and Disposal | Landfill methane recovery | Landfill / waste methane | Strong urban relevance; eligibility remains methodology-specific | Applicable to qualifying rural/municipal landfill projects | Computational implementation advanced; external numerical validation open |
| BM WA03.002 | Waste Handling and Disposal | Flaring or use of landfill gas | Landfill gas utilization | Strong urban relevance; eligibility remains methodology-specific | Applicable to qualifying rural/municipal landfill projects | Methodology-specific evidence required |
| BM AG04.001 | Agriculture | Methane recovery from livestock and manure management at households and small farms | Rural/agri-biogas | Possible peri-urban applicability where eligibility is met | Primary rural relevance | Methodology-specific evidence required |
| BM FR05.001 | Forestry | Afforestation and reforestation of degraded mangrove habitats | Nature / blue-carbon boundary | Only where eligible mangrove project exists | Only where eligible mangrove project exists | Methodology-specific evidence required |

## Platform architecture rule

RupayKg shall not create separate "urban formulas" and "rural formulas" for the same approved methodology. The canonical methodology engine remains jurisdiction/methodology-driven; urban/rural context is represented through project boundary, eligibility, data-source, monitoring and evidence attributes.

## Required evidence gates for every methodology

1. **Source lock** — exact BEE methodology/tool version, publication date and retrieval date.
2. **Eligibility mapping** — project eligibility and applicable sector boundary.
3. **Equation mapping** — every equation and parameter mapped to canonical engine fields.
4. **Parameter provenance** — default, measured, monitored or calculated status recorded for every parameter.
5. **Monitoring plan** — frequency, instrument/source, responsible party and evidence retention.
6. **Data lineage** — source → ingestion → normalization → calculation → result → audit hash.
7. **Uncertainty treatment** — methodology-prescribed uncertainty/model-correction treatment retained without substitution.
8. **Baseline/additionality treatment** — methodology-specific and never inferred from urban/rural labels.
9. **Intermediate reconciliation** — independent worked calculation compared at intermediate and final values.
10. **Verification package** — evidence bundle suitable for an Accredited Carbon Verification Agency (ACVA).
11. **Regression suite** — deterministic unit/integration/adversarial tests for the methodology engine.
12. **Version freeze** — calculation engine and methodology source versions are immutable for an evidence cycle.

## Urban context profile

Typical data/evidence sources may include municipal weighbridges, landfill cells, utility meters, industrial meters, SCADA, laboratory records, fleet/transport records and centralized waste-management systems. These are examples only; each methodology controls what constitutes acceptable monitoring evidence.

## Rural context profile

Typical data/evidence sources may include household/small-farm records, livestock counts, manure-flow measurements, village aggregation records, decentralized biogas instrumentation, agricultural records and field monitoring. These are examples only; each methodology controls what constitutes acceptable monitoring evidence.

## Critical rule for rural projects

Do not treat decentralized aggregation as automatically eligible. A rural platform project must prove the applicable methodology boundary, aggregation rules, ownership/control, monitoring and avoidance of double counting before credits are considered.

## Critical rule for urban projects

Do not treat municipal-scale data availability as proof of eligibility or additionality. Urban projects must still satisfy the applicable methodology, baseline, monitoring and verification requirements.

## RupayKg platform acceptance states

- **GREEN — Software Verified:** deterministic implementation and automated tests pass.
- **GREEN — Methodology Reconciled:** an authoritative or independently verified numerical case has been reconciled at intermediate and final levels.
- **AMBER — External Evidence Required:** software is implemented but independent numerical/reference evidence is not complete.
- **RED — Methodology Mismatch:** equation, parameter semantics, eligibility or monitoring boundary does not conform.
- **NOT APPLICABLE:** methodology is not applicable to the project's declared boundary.

## Current platform-wide position

The BEE catalogue currently contains eight approved methodologies across Energy, Industries, Waste Handling and Disposal, Agriculture and Forestry. BEE identifies Energy, Industries, Agriculture, Waste Handling and Disposal, Forestry and Transport within the Phase-I Offset Mechanism framework. The platform should therefore be built as a **multi-methodology MRV/crediting evidence OS**, not as a landfill-only calculator.

The existence of an approved BEE methodology does not by itself establish project eligibility or credit issuance. BEE's Detailed Procedure requires projects to pass the applicable project cycle and verification requirements.

## Source

BEE, Methodologies and Tools under Offset Mechanism, last updated 07 July 2026.
https://beeindia.gov.in/view_content.php?lang=1&lid=571
