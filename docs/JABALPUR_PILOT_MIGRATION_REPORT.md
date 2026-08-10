# RupayKg Carbon OS — Jabalpur Pilot Relocation Report

**Document ID**: `RKG-DOC-JBP-MIG-2026-001`  
**Date**: August 9, 2026  
**Status**: COMPLETED — CONTROLLED RELOCATION  

---

## Executive Summary
The RupayKg Carbon OS has undergone a controlled relocation from the legacy Gazipur (Delhi) demonstration pilot to the **Jabalpur Landfill Methane Recovery Pilot** (`RKG-JBP-WA03-001-001`) in Jabalpur, Madhya Pradesh, India.

All Gazipur-specific production references, calculated results (`21,406 tCO₂e/yr`), mock issue logs, and facility parameters have been removed or isolated. The new Jabalpur pilot starts with a **clean pre-validation state**, where missing values remain strictly `PENDING_VERIFICATION` or `DATA_GAP` and no unverified carbon reductions are displayed.

---

## 1. Relocation Checklist & Status

| Item # | Verification Domain | Status | Action Taken |
|--------|---------------------|--------|--------------|
| 1 | **Pilot Identity** | COMPLETED | Configured `JABALPUR LANDFILL METHANE RECOVERY PILOT` (`RKG-JBP-WA03-001-001`). Status set to `REAL PROJECT — PRE-VALIDATION / DATA COLLECTION`. |
| 2 | **Gazipur Removal & Isolation** | COMPLETED | Cleared production references. Created `legacy/pilot-fixtures/gazipur/legacyGazipurFixture.ts` for regression tests. Added contamination prevention guard. |
| 3 | **Data Source Control** | COMPLETED | Generated `docs/JABALPUR_PILOT_SOURCE_REGISTER.md` cataloging JMC, DEP Jabalpur, MPPCB, CPCB, and BEE CCTS records. |
| 4 | **District Environment Plan** | COMPLETED | Extracted Jabalpur DEP records (~450-500 TPD MSW, 35.4 ha site). Marked as `SECONDARY_SOURCE`. |
| 5 | **Facility Record** | COMPLETED | Created `JabalpurLandfillFacility` at Kathonda site. Set unknown fields to `PENDING_VERIFICATION`. |
| 6 | **Site Candidate Engine** | COMPLETED | Implemented `JABALPUR_SITE_CANDIDATE` selector (Kathonda Primary vs. Bhedaghat Secondary). |
| 7 | **GIS & Geolocation** | COMPLETED | Added Kathonda site boundary (23.2183° N, 79.8972° E). Labeled GIS data as `SUPPORTING EVIDENCE`. |
| 8 | **Waste Mapping** | COMPLETED | Mapped collection → weighbridge → landfill chain. Enforced zero double-counting against RDF/Compost. |
| 9 | **Historical & Legacy Waste** | COMPLETED | Separated Active Waste from Legacy Waste (estimated 1.2M tonnes). Marked unverified historical years as `DATA_GAP`. |
| 10 | **LFG Infrastructure** | COMPLETED | Set all gas equipment (wells, flare, meters) status to `NOT_CONFIRMED` until physical evidence uploaded. |
| 11 | **MRV Readiness** | COMPLETED | All instrument channels (flow, CH₄ analyzer, temp, pressure) initialized to `PENDING`. |
| 12 | **Carbon Result Reset** | COMPLETED | **Deleted 21,406 tCO₂e/yr result**. Active project carbon quantity displays `NOT YET CALCULATED`. States set to `PENDING` / `0`. |
| 13 | **ACVA & Ownership** | COMPLETED | Set `ACVA_STATUS = NOT_YET_APPOINTED` and `PROJECT_OWNER_STATUS = PENDING_VERIFICATION`. Enabled candidate selection. |
| 14 | **Operator Workflow & Learning** | COMPLETED | Built 13-step WhatsApp-simple operator workflow. Separated `GLOBAL_GUIDANCE` from `SITE_SPECIFIC_GUIDANCE`. |

---

## 2. Active Jabalpur Project Profile
- **Project Name**: Jabalpur Landfill Methane Recovery Pilot
- **Internal ID**: `RKG-JBP-WA03-001-001`
- **Location**: Kathonda, Patan Road, Jabalpur, Madhya Pradesh, India (23.2183° N, 79.8972° E)
- **Sector**: Waste Handling and Disposal
- **Candidate Methodology**: BM WA03.001 — Landfill methane recovery
- **Project Status**: `REAL PROJECT — PRE-VALIDATION / DATA COLLECTION`
- **Carbon Reductions**: `NOT YET CALCULATED` (Awaiting physical MRV telemetry)
- **Issued CCC**: `0`
- **ACVA Appointment**: `NOT_YET_APPOINTED`
- **CCTS Submission**: `NOT_SUBMITTED`
