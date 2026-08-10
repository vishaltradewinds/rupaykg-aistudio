# RUPAYKG CARBON OS — RURAL PHYSICAL & CARBON ACCOUNTING BOUNDARY REPORT

**Project ID:** `RKG-JBP-SIHORA-RURAL-001`  
**Parent Resource Hub:** Sihora Block Circular Resource & Gobar-Dhan Hub (`SIHORA-RURAL-HUB-JBP`)  
**Location:** Sihora Block, Jabalpur District, Madhya Pradesh, India (23.4862° N, 80.1124° E)  
**LGD Mapping:** Block LGD `3512` (Sihora) • District LGD `418` (Jabalpur)  
**Lead Entity:** Sihora Farmers Producer Organization (FPO) & Sihora Janpad Panchayat  
**Coverage:** 13 Participating Gram Panchayats & Peri-Urban Clusters (including Panagar Block LGD 3511) • 2,160 Enrolled Farmers • 2,820 Hectares  

---

## 1. Executive Overview: Adapting Urban Boundary Logic to the Rural Context

In urban waste management (such as the **Kathonda MSW Facility**), waste flows are concentrated at a single physical site containing distinct processing units (WTE, Landfill, RDF, Composting). In the **rural context**, waste feedstocks (cattle dung, paddy straw, crop residues, village organics, plastic film) are **decentralized across multiple Gram Panchayats, peri-urban centers, and agricultural land parcels**.

To maintain the same **Deterministic Pre-Calculation Control Architecture** without compromising auditability, RupayKg Carbon OS adopts a **Cluster Parent Facility Model**:
1. **Central Hub (Sihora Resource Hub):** Serves as the parent facility (`SIHORA-RURAL-HUB-JBP`) hosting centralized processing units (Bio-CNG digester, briquetting yard, pyrolysis kiln).
2. **Satellite Gram Panchayat & Peri-Urban Units:** Addressable sub-units for localized collection (Panagar Biomass Aggregation Depot, Women SHG Vermicomposting platforms, Village Plastic Recovery Centers, Amrit Sarovar pond restoration sites).
3. **Agristack Enrolled Farmland Boundary:** Geofenced farm polygons mapped directly to farmer Aadhaar/Agristack IDs across 13 Gram Panchayats/Clusters including Panagar.

---

## 2. Addressable Rural Sub-Units (`SIHORA_RURAL_SUB_UNITS`)

| Sub-Unit ID | Name & Description | LGD GP Code | Operator Entity | Target Feedstock | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UNIT-R01** | Sihora Gobar-Dhan Bio-CNG & Liquid FOM Digestion Unit | GP 138421 (Sihora) | Sihora Bio-Energy Farmer Cooperative | Cattle Dung (25-30 TPD) & Dairy Slurry | Methodology Target |
| **UNIT-R02** | Paddy Straw & Crop Residue Briquetting Yard | GP 138425 (Khitola) | Sihora Agri-Biomass FPO | Paddy Straw Stubble (8,000 TPY) | Operational |
| **UNIT-R03** | Pyrolysis & Permanent Biochar Conversion Unit | GP 138421 (Sihora) | Green Soil Biochar Enterprises | Woody Crop Residues & Cotton Stalks | Operational |
| **UNIT-R04** | Women SHG Vermicomposting & Organic Center | GP 138430 (Gosalpur) | Pragati Women SHG Cluster Federation | Village Organic Waste & Cattle Dung | Panchayat Shared |
| **UNIT-R05** | Gram Panchayat Plastic Recovery & Shredder | GP 138421 (Sihora) | Swachh Gaon Sanitation Samiti | Flexible Agricultural Film & Plastic | Operational |
| **UNIT-R06** | Enrolled Farmland Soil Carbon Sequestration Boundary | Multi-GP (13 Clusters) | Sihora Farmer Producer Company Ltd | Soil Organic Carbon (2,820 ha) | Agristack Geofenced |
| **UNIT-R07** | Amrit Sarovar Pond Restoration & Desilting Platform | GP 138435 (Majhgawan) | Majhgawan Pond Water Committee | Anaerobic Pond Silt & Sediment | Panchayat Shared |
| **UNIT-R08** | Panagar Peri-Urban Biomass & Agro-Organic Depot | GP 138480 (Panagar) | Panagar Agri-Cooperative & Samiti | Crop Straw & Vegetable Biomass (15 TPD) | Operational |

---

## 3. Participating Gram Panchayats (LGD & Agristack Mapping)

| Gram Panchayat / Cluster | LGD Code | Enrolled Farmers | Farmland Area (ha) | Gram Sabha Resolution Status |
| :--- | :--- | :--- | :--- | :--- |
| **Sihora GP** | `138421` | 280 Farmers | 360 ha | Passed & Verified |
| **Khitola GP** | `138425` | 240 Farmers | 310 ha | Passed & Verified |
| **Gosalpur GP** | `138430` | 210 Farmers | 290 ha | Passed & Verified |
| **Majhgawan GP** | `138435` | 190 Farmers | 250 ha | Pending Verification |
| **Sarond GP** | `138440` | 160 Farmers | 210 ha | Passed & Verified |
| **Mohtara GP** | `138445` | 150 Farmers | 190 ha | Passed & Verified |
| **Bargi GP** | `138450` | 140 Farmers | 180 ha | Pending Verification |
| **Umaria GP** | `138455` | 130 Farmers | 160 ha | Passed & Verified |
| **Pipariya GP** | `138460` | 110 Farmers | 140 ha | Passed & Verified |
| **Dhamdha GP** | `138465` | 90 Farmers | 120 ha | Pending Verification |
| **Sihoda GP** | `138470` | 80 Farmers | 110 ha | Passed & Verified |
| **Chandiya GP** | `138475` | 70 Farmers | 80 ha | Passed & Verified |
| **Panagar Cluster** | `138480` | 310 Farmers | 420 ha | Passed & Verified |

---

## 4. Rural Mass Balance Accounting Engine (`RuralBiomassMassBalanceEngine`)

Rural biomass and manure undergo wet matter decomposition, moisture loss, and gas evolution. The mass balance equation enforces conservation of dry solids:

$$\text{Wet Biomass In (TPD)} = \text{Bio-CNG (Tonnes)} + \text{Liquid FOM (TPD)} + \text{Briquettes (TPD)} + \text{Biochar (TPD)} + \text{Vermicompost (TPD)} + \text{Evaporated Moisture}$$

- **Physical Tolerance Limit:** A mass loss of $\le 35\%$ due to moisture evaporation and gas evolution during anaerobic digestion or composting is physically expected and accepted as `BALANCED`.
- **Audit Trigger:** Unaccounted mass loss exceeding 35% blocks carbon calculation until dry matter lab analysis reconciles moisture content.

---

## 5. Rural Double-Counting Prevention Matrix (Rules R-A to R-F)

| Rule ID | Violation Condition | Control Action |
| :--- | :--- | :--- |
| **Rule R-A** | Paddy straw stubble claimed under both In-Field Burning Avoidance and Grid Power Offset. | **BLOCKED:** Feedstock deducted from baseline before power claim. |
| **Rule R-B** | Cattle dung claimed simultaneously in Gobar-Dhan Bio-CNG and raw dung vermicompost. | **BLOCKED:** Digester slurry cannot double-claim raw dung credits. |
| **Rule R-C** | Biochar applied on farmland double-claimed under Pyrolysis Removal (BC-01) and Soil Carbon. | **BLOCKED:** Must register under single removal protocol. |
| **Rule R-D** | Enrolled farm parcel registered with multiple FPOs or carbon project developers. | **BLOCKED:** Agristack ID & Khasra geofence prevents overlapping registration. |
| **Rule R-E** | Liquid FOM organic fertilizer displacement claimed under conflicting credit pools. | **BLOCKED:** Liquid FOM tracked via digital flow meter `SL-RURAL-01`. |
| **Rule R-F** | Bio-CNG fuel claimed as both green tractor fuel and anaerobic digester methane capture. | **BLOCKED:** Fuel distribution separate from digester capture. |

---

## 6. 14-Point Rural Pre-Calculation Control Gate (`RuralCalculationGate`)

Carbon calculation remains strictly `RURAL_CALCULATION_BLOCKED` until all 14 conditions are satisfied:

1. **LGD Code Verified:** Local Government Directory GP & Block codes validated.
2. **Central Hub Land Deed Verified:** Khasra 452/1, 452/2 survey deed uploaded.
3. **Farmer Agristack Mapped:** Farmer IDs & farm boundary polygons mapped via Agristack.
4. **Gram Sabha Resolution Passed:** Passed across all 12 participating Gram Panchayats.
5. **Gobar Gas Meter Mapped:** Gas flow meter `FM-RURAL-01` mapped.
6. **Liquid Slurry Meter Mapped:** Flow meter `SL-RURAL-01` mapped.
7. **Digital Weighbridge Mapped:** Digital weighbridge scale at Sihora Central Hub registered.
8. **Moisture Sensor Calibrated:** Digital moisture analyzer NABL calibrated.
9. **Satellite Stubble Baseline:** Sentinel-2 / Landsat stubble fire baseline verified.
10. **Biomass Mass Balance Cleared:** Dry matter reconciled within 35% physical tolerance.
11. **Rural Double Counting Cleared:** All 6 rural anti-double-counting rules verified.
12. **FPO/SHG Revenue Agreement:** Signed revenue-sharing contracts verified.
13. **Methodology Applicability:** Target rural unit meets specific protocol criteria.
14. **Primary Evidence Hash:** SHA-256 evidence hashes verified on-chain.

---

## 7. Verification & Audit Trail

All physical boundary records, mass balance runs, and gate evaluations are executable live via the Carbon OS API and UI:
- **API Endpoints:** `/api/carbon/rural/hub`, `/api/carbon/rural/mass-balance`, `/api/carbon/rural/double-counting-audit`, `/api/carbon/rural/calculation-gate`.
- **UI Cockpit Tab:** *Sihora Rural Hub & Gobar-Dhan* tab in `PilotReadinessCockpit.tsx`.
- **Automated Tests:** `RKG-JBP-SIHORA-RURAL-BOUNDARY-001` in `src/__tests__/carbonOs.test.ts`.
