# GRI Cross-Mapping Schema Extension — RupayKg Carbon OS

**Status:** Engineering proposal; not yet production-certified.  
**Schema version:** 1.0.0  
**Scope:** Pan-India configurable cross-mapping across GRI sustainability disclosures, Indian statutory requirements, EPR, CCTS, BRSR/ESG, and relevant voluntary integrity frameworks.

## 1. Design rule

A cross-map is a traceable relationship between requirements; it is not an equivalence claim. GRI reporting does not replace Indian law, regulator filings, CCTS eligibility, EPR certificates, methodology validation, independent verification, or credit issuance. Each framework retains its own authority, applicability rules, reporting periods, calculation boundaries, and approval status.

## 2. GRI standards registry baseline

The registry must store the exact standard version and effective date, not just a disclosure code. Initial coverage should include:
- GRI 1, GRI 2 and GRI 3 Universal Standards (2021).
- GRI 301 Materials (2016), GRI 302 Energy (2016), GRI 303 Water and Effluents (2018), GRI 305 Emissions (2016), GRI 306 Waste (2020), GRI 308 Supplier Environmental Assessment (2016).
- Relevant social/governance topic standards after materiality and sector screening.
- GRI 101 Biodiversity (2024), effective for reporting from January 2026.
- GRI 102 Climate Change and GRI 103 Energy (2025), scheduled to be effective for reporting from January 2027; support effective-dated coexistence and transition rather than silently rewriting historical mappings.

Verify current authoritative versions from the GRI Standards Resource Center before approval or release.

## 3. Record contract

The JSON Schema at `schemas/gri-cross-mapping.schema.json` defines one mapping record. Every record must include:
- Stable mapping ID and schema version.
- Source requirement identity, version, authority type, source URL and effective dates.
- Target framework, standard, disclosure, version and effective date.
- Relationship classification: equivalent, partial overlap, supports, contextual, no direct equivalence, or conflict requiring review.
- Explicit applicability determination and basis.
- Metric units, method, boundary, disaggregation and calculation version where applicable.
- Evidence identifiers, provenance, integrity status, reporting period and lineage completeness.
- Validation, double-counting, assurance and compliance conclusions.
- Named owner/approver roles and change-log reference.

## 4. Initial cross-map candidates (must be legally and technically reviewed)

| RupayKg domain / source | GRI target candidate | Relationship | Key limitation |
|---|---|---|---|
| Waste generation, composition and significant waste impacts | GRI 306-1 to 306-5 (Waste 2020) | Supports / partial overlap | GRI metrics and definitions may differ from Indian regulatory categories and EPR returns. |
| Material inputs, recycled content and circularity | GRI 301 Materials 2016; GRI 306 Waste 2020 | Supports | Do not infer recycled-content claims from waste-handling records alone. |
| Organizational GHG emissions | GRI 305 Emissions 2016; transition to GRI 102 Climate Change 2025 by effective date | Supports | Inventory boundary, scopes, gases, factors and reporting period must be explicit. |
| Energy consumption | GRI 302 Energy 2016; transition to GRI 103 Energy 2025 by effective date | Supports | Energy data is not itself proof of CCTS target compliance. |
| Water and effluents | GRI 303 Water and Effluents 2018 | Supports | Preserve location, basin/context, withdrawal, consumption and discharge distinctions. |
| Supplier/environmental due diligence | GRI 308 Supplier Environmental Assessment 2016; relevant Universal Standards | Contextual / supports | Requires supplier-risk and impact evidence, not just supplier registration. |
| Governance, policies, reporting practices | GRI 2 General Disclosures 2021; GRI 3 Material Topics 2021 | Supports | Material topics and management disclosures require organization-specific assessment. |
| Indian EPR obligation | Relevant GRI material/waste disclosures | Partial overlap | GRI is not an EPR filing, certificate, portal acknowledgement, or legal-compliance decision. |
| Indian CCTS obligation / carbon-credit project | Relevant GRI climate/emissions disclosures | Partial overlap | GRI disclosure cannot determine CCTS eligibility, issuance, ownership, or transfer of CCCs. |
| ICVCM Core Carbon Principles | Relevant GRI climate and governance disclosures | Contextual | Integrity benchmark remains separate from statutory obligations and crediting-program decisions. |

The table is a starting register, not an approved authoritative crosswalk. Do not label any row “equivalent” without documented clause-by-clause review.

## 5. Data and control requirements

1. **Effective dating:** preserve old versions and reporting-period snapshots; never mutate a published report in place.
2. **Applicability gate:** distinguish applicable, not applicable, conditional and undetermined. “Undetermined” blocks a final compliance conclusion.
3. **Evidence lineage:** every reported figure must resolve to source evidence, source period, unit, conversion, calculation version, reviewer and exception history.
4. **Units and boundaries:** reject incompatible units or boundaries unless a documented conversion is applied. Preserve gross/net values and Scope 1/2/3 boundaries as applicable.
5. **Double counting:** reconcile waste weights across generator, collector, processor, recycler and disposal facility; do not sum custody-stage duplicates as separate physical quantities.
6. **Claims separation:** keep GRI disclosure completeness, statutory compliance, independent assurance, and carbon-credit eligibility as separate statuses.
7. **Human approval:** legal/regulatory mappings require compliance-owner approval; GRI interpretations require sustainability/reporting-owner approval; methodology and credit conclusions require competent independent review where applicable.
8. **Fail closed:** missing evidence, unverified source, stale standard version, unresolved conflict, failed reconciliation or unknown applicability blocks “approved” publication.
9. **Privacy and security:** store evidence references/hashes and access controls; avoid copying unnecessary personal data into reports.
10. **No certification implication:** user-facing exports may say “GRI-mapped” or “prepared with reference to selected GRI disclosures” only when accurate. Do not say “GRI certified” unless an independently substantiated authorization supports that exact claim.

## 6. Suggested report statuses

- `draft`: mapping is being assembled.
- `reviewed`: technical review completed, approval pending.
- `approved`: designated owners approved this version for the defined scope and period.
- `deprecated`: superseded by a later mapping version.
- `blocked`: material defect or unresolved regulatory interpretation prevents use.

Approval of a mapping does not mean the reporting organization complies with the source requirement.

## 7. Release gates (Shakti Standards)

- **Gate A — Source currency:** official source and effective dates verified.
- **Gate B — Applicability:** entity, activity, threshold, geography and period rules documented.
- **Gate C — Mapping quality:** clause-level rationale and limitations reviewed.
- **Gate D — Data integrity:** units, boundaries, provenance, reconciliation and double counting tested.
- **Gate E — Reporting validation:** required disclosures, omissions, materiality and content-index references validated.
- **Gate F — Independent review:** assurance/verification status represented accurately; no self-asserted external assurance.
- **Gate G — Release:** versioned snapshot, audit trail, export tests, access controls and rollback plan pass.

## 8. Initial acceptance tests

- Reject records missing source or target version.
- Reject `approved` mapping when applicability is `undetermined`.
- Reject unsupported claims of equivalence without rationale and reviewer approval.
- Keep GRI status independent from EPR/CCTS compliance status.
- Preserve historical mappings when a GRI version becomes effective.
- Prevent double-counting of the same physical waste quantity across custody events.
- Block final reporting when required evidence is missing, quarantined or rejected.
- Ensure an absent policy or practice can be reported transparently where the relevant GRI disclosure permits, rather than silently marking it compliant.
- Ensure GRI 102/103 transition logic respects the January 2027 effective date.
- Verify exports show reporting period, framework version, limitations, omissions and assurance status.

## 9. Official references

- GRI Standards overview: https://www.globalreporting.org/standards/
- GRI Universal Standards: https://globalreporting.org/standards/standards-development/universal-standards/
- GRI 306 Waste 2020: https://www.globalreporting.org/publications/documents/english/gri-306-waste-2020
- GRI Standards development/effective dates: https://www.globalreporting.org/standards/standards-development/

**Current engineering disposition:** schema and design documentation are a proposed extension. Application integration, automated validation, UI/report exports, regression tests, and regulatory-owner sign-off remain unproven until implemented and tested in the repository's runtime.
