# RupayKg — ICVCM CCP Control Register
Register version: 1.0.0
Status: Proposed controls; implementation coverage must be verified against code and evidence.
Scope: Complementary voluntary carbon-market integrity controls.

## Binding interpretation
This register maps the ten ICVCM Core Carbon Principles into platform controls. It is not an ICVCM assessment, CCP label, crediting-program approval, methodology approval, or substitute for Indian statutory compliance. Keep Indian statutory/CPCB/EPR/SWM/CCTS obligations in a separate mandatory lane.

| ID | Principle | Control requirement | Evidence object | Test / release gate |
|---|---|---|---|---|
| CCP-01 | Effective governance | Versioned policies, accountable owners, segregated duties, conflicts and grievances | governance decision, policy version, conflict declaration, grievance case | Missing owner/approval or unresolved critical conflict blocks approval |
| CCP-02 | Tracking | Unique activity, monitoring period, calculation, credit and retirement references; reconcile registries | project ID, activity ID, batch ID, credit serial, registry event | Duplicate identity or inconsistent registry state is quarantined |
| CCP-03 | Transparency | Controlled disclosure of project, methodology, monitoring, assumptions and status | disclosure manifest, document version, redaction record | Unsupported public claims fail |
| CCP-04 | Independent validation/verification | Independent validator/verifier and separation from operator/preparer | verifier identity, independence declaration, validation/verification report | Conflict or absent signed report blocks assurance status |
| CCP-05 | Additionality | Methodology-specific baseline and additionality evidence | baseline case, assessment, evidence links | AI assists but cannot be sole approving authority |
| CCP-06 | Permanence | Reversal-risk monitoring and response, buffer/remedy where applicable | risk record, monitoring plan, reversal event | Unmitigated critical risk blocks clearance |
| CCP-07 | Robust quantification | Pin methodology/tool version; validate units, inputs, uncertainty and conservativeness | methodology lock, input lineage, calculation run, reference fixture | Reconciliation mismatch blocks issuance-ready status |
| CCP-08 | No double counting | Detect overlap, duplicate claims and issuance/retirement conflicts | overlap check, registry reconciliation, claim record | Conflict triggers quarantine and manual resolution |
| CCP-09 | Sustainable development safeguards | Record environmental/social screening, community rights, grievances and remediation | safeguard screen, consultation, grievance, remediation action | Unresolved critical issue blocks clearance |
| CCP-10 | Net-zero transition | Assess transition consistency and material carbon lock-in | transition assessment, rationale, reviewer sign-off | Missing rationale prevents positive integrity conclusion |

## Required metadata
Every control record must include control ID, framework name/version, source URL, publication date when known, retrieval date, source SHA-256, applicability, owner role, evidence references, test references, status, exceptions, reviewer, review date and next review due.

Allowed statuses: NOT ASSESSED, DESIGNED, IMPLEMENTED UNVERIFIED, PASS, AMBER, FAIL, NOT APPLICABLE WITH RATIONALE.

## Evidence and AI policy
- Preserve original source artefacts; retain hashes and immutable version references.
- Distinguish raw measurements, derived data, calculations, verifier decisions and public claims.
- AI may classify, summarize, flag anomalies and draft workflows. It must not invent evidence, approve its own output, override statutory rules or replace an independent verifier.
- Material changes create a new version and impact assessment.
- A control is not PASS merely because a document, endpoint, database column or test name exists.

## Label and claims restriction
ICVCM states a CCP label can be given only to credits issued using a CCP-Approved methodology applied under a CCP-Eligible crediting program. RupayKg may track/evidence status; it must not independently award or imply the label. Check the current official ICVCM assessment-status page at the time of any claim.
