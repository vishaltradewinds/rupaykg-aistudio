# KATHONDA MSW PROCESSING & DISPOSAL FACILITY — PHYSICAL & CARBON ACCOUNTING BOUNDARY REPORT

**Project Identifier:** `RKG-JBP-WA03-001-001`  
**Parent Facility ID:** `KATHONDA-COMPLEX-JBP`  
**Site Candidate:** Kathonda MSW Processing & Disposal Facility (Patan Road, Jabalpur, MP)  
**Methodology:** BEE CCTS Published Methodology — **BM WA03.001** (Landfill Methane Recovery)  
**Status:** `PRE-CALCULATION CONTROL ACTIVE` — Calculation Gate Locked (`CALCULATION_BLOCKED`)  
**Active Carbon Calculation Result:** `NOT YET CALCULATED` (Verified: `0 tCO₂e`, Issued CCC: `0`)

---

## 1. EXECUTIVE SUMMARY

This report establishes the physical, operational, and carbon accounting boundary for the **Jabalpur Landfill Methane Recovery Pilot** located at the Kathonda MSW Processing & Disposal Facility (`SITE-JBP-01`) under the administration of the Jabalpur Municipal Corporation (JMC), Madhya Pradesh.

Following strict CCTS regulatory principles and BEE methodology **BM WA03.001**, the Kathonda facility is classified as a **Complex Multi-Unit Waste Processing Facility**. The platform rejects any oversimplified assumption that treats the entire Kathonda complex as a single homogeneous landfill emission source.

Before any real carbon calculation is permitted, the RupayKg Carbon OS enforces a **Deterministic Pre-Calculation Control Architecture**:
1. **Parent Facility Hierarchy:** Establishment of `KATHONDA-COMPLEX-JBP` containing 7 independently addressable operational sub-units.
2. **Physical Boundary Identification:** Formal mapping of Khasra numbers 102, 104, 105/1, and 105/2 covering 35.4 hectares.
3. **Carbon Accounting Boundary Segregation:** Strict segregation of landfill methane extraction (`UNIT-06`) from thermal waste-to-energy (`UNIT-01`), legacy biomining (`UNIT-03`), RDF production (`UNIT-04`), and composting (`UNIT-07`).
4. **Waste Mass Balance Reconciliation:** Continuous mass conservation tracking between incoming fresh MSW (450–500 TPD DEP estimate) and output streams.
5. **Double-Counting Prevention Matrix:** Automated enforcement of 6 anti-double-counting checks (Rules A through F).
6. **14-Point Pre-Calculation Control Gate:** Requirement for all 14 physical boundary and telemetry conditions to be verified before BM WA03.001 calculation execution.

---

## 2. FACILITY HIERARCHY & OPERATIONAL SUB-UNITS

The Kathonda facility is registered as parent record `KATHONDA-COMPLEX-JBP` (Location: Patan Road, Jabalpur, MP • Lat/Long: 23.2183° N, 79.8972° E • Area: 35.4 Hectares • Owner: Jabalpur Municipal Corporation).

To prevent accounting overlap and double-counting across different carbon protocols, the complex is partitioned into 7 addressable units:

| Unit ID | Unit Name | Sub-Unit Type | Boundary & Scope | Waste Stream Handled | Applicable Methodology | Target Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **UNIT-01** | WTE Incineration Plant | `WTE_PLANT` | Boiler, Stack, Turbine | Fresh Dry MSW | Thermal Baseline (Separate) | `EXCLUDED_FROM_WA03_001` |
| **UNIT-02** | Fresh MSW Receiving & Processing | `PROCESSING_FACILITY` | Weighbridge, Segregators | Raw Mixed MSW | Intake Accounting | `EXCLUDED_FROM_WA03_001` |
| **UNIT-03** | Legacy Waste Mining Area | `LEGACY_WASTE_CELL` | Trommel, Mining Pit | Historical Dumpsite Waste | BM-T-011 / Separate | `EXCLUDED_FROM_WA03_001` |
| **UNIT-04** | RDF Recovery & Storage | `RDF_RECOVERY` | Shredder, Baling Yard | Refuse-Derived Fuel | Co-processing (Cement) | `EXCLUDED_FROM_WA03_001` |
| **UNIT-05** | Bottom Ash & Fly Ash Area | `ASH_MANAGEMENT` | Ash Pits, Disposal Cell | Incinerator Residual Ash | Inert Disposal | `EXCLUDED_FROM_WA03_001` |
| **UNIT-06** | Scientific Landfill & Disposal Cell | `SCIENTIFIC_LANDFILL` | Cell 1/2, LFG Header | Anaerobic Disposal Residuals | **BM WA03.001 Target** | `METHODOLOGY_WA03_001_TARGET` |
| **UNIT-07** | Biomethanation / Compost Unit | `COMPOST_PLANT` | Windrows, Anaerobic Digester | Wet Organic Waste | Methane Avoidance | `EXCLUDED_FROM_WA03_001` |

---

## 3. PHYSICAL LEGAL BOUNDARY & SURVEY RECORDS

### 3.1 Primary Legal Land Record
* **Facility Name:** Kathonda MSW Processing & Disposal Facility
* **Survey Reference:** Survey Revenue Record / Khasra Map
* **Khasra Numbers:** Khasra 102, Khasra 104, Khasra 105/1, Khasra 105/2
* **Total Area:** 35.4 Hectares (354,000 m²)
* **GIS Polygon Boundary:** `POLYGON((79.8950 23.2160, 79.8990 23.2160, 79.8990 23.2200, 79.8950 23.2200, 79.8950 23.2160))`
* **Verification Status:** `PENDING_PRIMARY_DEED_UPLOAD`

### 3.2 Legal Ownership & Title Deed Protocol
The platform strictly distinguishes between secondary administrative records (e.g., District Environment Plans, NGT status reports) and primary legal project evidence.
* **Rule:** Satellite imagery or GIS shapefiles alone are **insufficient** to establish legal project boundary rights under BEE CCTS rules.
* **Mandated Primary Documents:**
  1. Registered Government Land Allotment Deed / Title Deed for Khasra 102, 104, 105/1, 105/2.
  2. JMC General Council Resolution authorizing carbon project rights.
  3. Official Concession Agreement executed between JMC and the facility operator (Essel Jabalpur MSW Ltd / successor entity).

---

## 4. CARBON ACCOUNTING BOUNDARY SEGREGATION

In compliance with **BM WA03.001 Section 4 (Project Boundary)**, the carbon accounting boundary covers the physical site where waste is landfilled and methane gas is captured and combusted/destroyed.

```
+-----------------------------------------------------------------------------------+
|                           KATHONDA COMPLEX PARENT FACILITY                        |
|                                                                                   |
|  +---------------------+   +---------------------+   +-------------------------+  |
|  | UNIT-01: WTE Plant  |   | UNIT-03: Legacy Pit |   | UNIT-04: RDF Processing |  |
|  | (Thermal Baseline)  |   | (BM-T-011 Decay)    |   | (Co-processing)         |  |
|  | [EXCLUDED]          |   | [EXCLUDED]          |   | [EXCLUDED]              |  |
|  +---------------------+   +---------------------+   +-------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                    BM WA03.001 CARBON ACCOUNTING BOUNDARY                   |  |
|  |                                                                             |  |
|  |  +-----------------------+     +-------------------+     +---------------+  |  |
|  |  | UNIT-06 Landfill Cell | --> | LFG Header Piping | --> | Gas Meter     |  |  |
|  |  | (Anaerobic Decay)     |     | (Wells & Headers) |     | (FM-JBP-01)   |  |  |
|  |  +-----------------------+     +-------------------+     +---------------+  |  |
|  |                                                                  |          |  |
|  |                                                                  v          |  |
|  |                                                          +---------------+  |  |
|  |                                                          | Destruct Unit |  |  |
|  |                                                          | (Flare/Gen)   |  |  |
|  |                                                          +---------------+  |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

### 4.1 Included Methane Sources
* Methane generated in anaerobic landfill disposal cell (`UNIT-06`).
* Fugitive emissions from landfill cell surface prior to extraction.
* Methane captured by extraction wells and headers (`LFG-SYS-JBP-01`).
* Methane combusted in high-efficiency enclosed flare (`FLR-JBP-01`) or gas engine.

### 4.2 Excluded Methane & Emission Sources
* **WTE Stack Emissions (`UNIT-01`):** Thermal combustion of MSW is governed under power generation/thermal avoidance methodologies, NOT BM WA03.001.
* **Legacy Biomining Emissions (`UNIT-03`):** Aerobic excavation of legacy waste does not constitute enclosed landfill methane recovery.
* **RDF Co-processing (`UNIT-04`):** Fossil fuel replacement in cement kilns represents a separate product credit stream.
* **Compost Decomposition (`UNIT-07`):** Aerobic organic waste processing is excluded from landfill gas capture calculations.

---

## 5. WASTE MASS BALANCE RECONCILIATION ENGINE

To prevent ghost waste reporting and double counting, incoming waste quantities are subjected to a real-time mass conservation audit.

$$\text{Incoming MSW} = \text{WTE Feed} + \text{RDF Storage} + \text{Compost Feed} + \text{Landfill Disposal} + \text{Recycled Material} + \Delta\text{Unaccounted}$$

### 5.1 Fresh MSW Mass Balance Specification
* **DEP Base Intake Estimate:** 480 TPD
* **Maximum Acceptable Discrepancy Tolerance:** $\le 5\%$ (or $\le 25$ TPD)
* **Reconciliation Rules:**
  1. If $\Delta\text{Unaccounted} > 5\%$, the system flags `IMBALANCED_WARNING` and freezes carbon calculation.
  2. Any waste directed to WTE (`UNIT-01`), RDF (`UNIT-04`), or Composting (`UNIT-07`) is **permanently deducted** from the landfill methane baseline feedstock.

### 5.2 Legacy Waste Biomining Mass Balance Specification
* **Event ID:** `REM-JBP-2025-01` (Trommel Segregation Audit)
* **Total Excavated Material:** 10,000 Tonnes
* **RDF Fraction Recovered:** 3,500 Tonnes
* **Inert Rejected Material:** 4,500 Tonnes
* **Soil & Material Recycled:** 2,000 Tonnes
* **Rule:** Legacy waste biomining products cannot be claimed under BM WA03.001 landfill gas recovery without separate baseline decay verification under BM-T-011.

---

## 6. DOUBLE-COUNTING PREVENTION MATRIX

The RupayKg Carbon OS enforces 6 strict anti-double-counting controls:

| Check Rule | Scope | Description | System Enforcement Action |
| :--- | :--- | :--- | :--- |
| **Check A** | WTE + Landfill Overlap | Same MSW mass claimed in both WTE thermal baseline and Landfill methane baseline. | `CARBON_CLAIM_BLOCKED` |
| **Check B** | Legacy RDF + Landfill Overlap | Remediated legacy waste claimed as both cement RDF and landfill methane feedstock. | `CARBON_CLAIM_BLOCKED` |
| **Check C** | Flaring + Generation Overlap | Methane gas flow double-counted in flare destruction and electricity generation. | `CARBON_CLAIM_BLOCKED` |
| **Check D** | Multi-Project Registration | Landfill gas extraction system registered under multiple carbon registries. | `CARBON_CLAIM_BLOCKED` |
| **Check E** | REC + Carbon Offset Double Claim | Green power exported claimed as both Renewable Energy Certificates (RECs) and Carbon Offsets. | `CARBON_CLAIM_BLOCKED` |
| **Check F** | Multi-Program Legacy Claim | Biomining remediation claimed under multiple state/national credit programs simultaneously. | `CARBON_CLAIM_BLOCKED` |

---

## 7. PATHWAY SEPARATION & SEPARATE ACCOUNTING

The platform strictly prohibits aggregating separate waste pathways into a single combined emission reduction figure.

| Pathway ID | Pathway Name | Target Unit | Applicable Methodology | Active Carbon Result |
| :--- | :--- | :--- | :--- | :--- |
| `PATH-JBP-01` | Landfill Methane Recovery | `UNIT-06` (Scientific Landfill) | **BM WA03.001** | `NOT YET CALCULATED` |
| `PATH-JBP-02` | WTE Thermal Power Generation | `UNIT-01` (WTE Plant) | Grid Displacement / Thermal | `NOT YET CALCULATED` |
| `PATH-JBP-03` | RDF Cement Co-processing | `UNIT-04` (RDF Recovery) | Fuel Substitution | `NOT YET CALCULATED` |
| `PATH-JBP-04` | Legacy Waste Remediation | `UNIT-03` (Legacy Waste) | BM-T-011 Decay | `NOT YET CALCULATED` |

---

## 8. 14-POINT PRE-CALCULATION CONTROL GATE STATUS

The **Kathonda Calculation Gate** serves as the final automated arbiter. All 14 physical and telemetry checks must be satisfied before the BM WA03.001 deterministic engine is permitted to execute:

1. `projectBoundaryVerified`: Legal title deed and Khasra allotment verified. (`FALSE`)
2. `landfillBoundaryVerified`: Physical fencing and cell demarcation verified. (`FALSE`)
3. `applicableCellsIdentified`: Landfill Cell 1 & 2 designated. (`TRUE`)
4. `lfgSystemMapped`: Extraction wells and headers mapped to gas meter `FM-JBP-01`. (`FALSE`)
5. `gasMeterMapped`: High-accuracy thermal mass flow meter registered in telemetry pipeline. (`FALSE`)
6. `methaneAnalyzerMapped`: Continuous infrared/NDIR gas analyzer registered. (`FALSE`)
7. `calibrationVerified`: NABL calibration certificate uploaded for all sensors. (`FALSE`)
8. `historicalWasteEvidence`: Weighbridge logs and waste receipt history cataloged. (`TRUE`)
9. `currentMonitoringData`: Real-time physical MRV telemetry stream online. (`FALSE`)
10. `wasteMassBalanceCleared`: Mass balance reconciliation within 5% tolerance. (`TRUE`)
11. `doubleCountingChecksPassed`: All 6 matrix checks cleared. (`TRUE`)
12. `carbonOwnershipVerified`: Signed JMC resolution granting carbon rights. (`FALSE`)
13. `methodologyApplicabilityCleared`: Target facility meets BM WA03.001 applicability requirements. (`TRUE`)
14. `evidenceCompletenessChecked`: Primary documentary hash audit verified. (`FALSE`)

### Gate Status Evaluation
* **Overall Gate Status:** `CALCULATION_BLOCKED`
* **Passed Checks:** 5 / 14
* **Failed Checks:** 9 / 14
* **Active Carbon Display:** `NOT YET CALCULATED`
* **Verified Carbon Issued:** `0 tCO₂e`
* **Official Carbon Credits (CCC):** `0`

---

## 9. REGULATORY DOCUMENT HISTORY & TIMELINE

Secondary government records cataloged for facility context:

1. **Environmental Clearance (EC):**
   * *Ref:* `293/SEIAA/13` (Date: 2013-11-22)
   * *Issuer:* MP State Environment Impact Assessment Authority (SEIAA)
   * *Hash:* `DOC-EC-2013-SEIAA-293-JBP`
   * *Notes:* Granted for integrated MSW processing facility and 11.5 MW WTE plant at Kathonda.
2. **Consent to Establish / Operate (CTO):**
   * *Ref:* `CTO-MPPCB-2015-W-8821` (Date: 2015-06-14)
   * *Issuer:* MP Pollution Control Board (MPPCB)
   * *Hash:* `DOC-CTO-2015-MPPCB-8821`
   * *Notes:* Facility consent to operate for MSW handling and processing.
3. **JMC Land Resolution:**
   * *Ref:* `JMC-RES-2014-102` (Date: 2014-03-10)
   * *Issuer:* Jabalpur Municipal Corporation Council
   * *Hash:* `DOC-JMC-RES-2014-102`
   * *Notes:* Allotment of 35.4 hectares land at Kathonda for MSW facility.
4. **WTE Concession Agreement:**
   * *Ref:* `JMC-WTE-2016-CONC` (Date: 2016-08-18)
   * *Issuer:* JMC & Essel Jabalpur MSW Ltd
   * *Hash:* `DOC-JMC-WTE-CONC-2016`
   * *Notes:* Concession agreement for 11.5 MW Waste-to-Energy plant.
5. **NGT Monitoring Order:**
   * *Ref:* `NGT-OA-2022-606` (Date: 2022-11-15)
   * *Issuer:* National Green Tribunal (Principal Bench)
   * *Hash:* `DOC-NGT-OA-2022-606`
   * *Notes:* **Flagged as regulatory compliance proceeding, NOT an operating permit.** Mandatory remediation timeline ordered for legacy waste dumpsite.

---

## 10. GAS METER TRACEABILITY CHAIN

Every telemetry data point must trace back to a physical sensor located within `UNIT-06`:

$$\text{Gas Meter } \mathbf{FM\text{-}JBP\text{-}01} \longrightarrow \text{Cell } \mathbf{CELL\text{-}01} \longrightarrow \text{LFG System } \mathbf{LFG\text{-}SYS\text{-}JBP\text{-}01} \longrightarrow \text{Facility } \mathbf{KATHONDA\text{-}COMPLEX\text{-}JBP}$$

* **Meter ID:** `FM-JBP-01` (Thermal Mass Flow Meter)
* **Associated Gas Analyzer:** `MA-JBP-01` (Continuous Methane Analyzer % CH₄)
* **Calibration Authority:** NABL Accredited Calibration Laboratory
* **Calibration Status:** `PENDING_CALIBRATION_UPLOAD`
* **Rule:** Methane telemetry from unmapped or uncalibrated meters is strictly rejected by `gasMeterTraceabilityEngine`.

---

## 11. DATA ISOLATION & GAZIPUR CONTAMINATION PREVENTION

* **Gazipur Legacy Isolation:** All synthetic numbers from the Gazipur Gazipur Landfill Methane Recovery Pilot (such as `21,406 tCO₂e/year`) have been completely purged from the active Jabalpur project space.
* **Zero Fabrication Rule:** No landfill measurements, waste receipt volumes, gas flow rates, or methane concentrations are fabricated. Unknown parameters remain strictly `NOT_PROVIDED` or `PENDING_VERIFICATION`.

---

## 12. CONCLUSION & ACTIONABLE NEXT STEPS

The Kathonda MSW Processing & Disposal Facility (`KATHONDA-COMPLEX-JBP`) is successfully configured as a parent complex with 7 segregated sub-units, physical boundary mapping, and rigorous anti-double-counting rules.

**Action Plan to Unlock Calculation Gate:**
1. Upload primary Land Title Deed for Khasra 102, 104, 105/1, 105/2.
2. Upload signed JMC General Council Resolution authorizing carbon credit rights.
3. Conduct physical NABL calibration audit for gas meter `FM-JBP-01` and analyzer `MA-JBP-01`.
4. Establish live physical MRV telemetry stream for LFG extraction wells in `UNIT-06`.
5. Appoint an independent empanelled ACVA for waste sector validation.

---
*Report Generated by RupayKg Carbon OS Phase 6.5 Deterministic Governance Engine*  
*Timestamp: 2026-08-09 | Audit Hash: `HASH-KATHONDA-BOUNDARY-REPORT-2026-08`*
