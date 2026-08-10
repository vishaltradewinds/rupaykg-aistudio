# Jabalpur Carbon Pilot — Authoritative Source Register

**Project Identity**: Jabalpur Landfill Methane Recovery Pilot  
**Internal Project ID**: `RKG-JBP-WA03-001-001`  
**Location**: Jabalpur, Madhya Pradesh, India  
**Sector**: Waste Handling and Disposal  
**Candidate Methodology**: BM WA03.001 — Landfill Methane Recovery  

---

## Authoritative Source Catalog

| Source ID | Source Name | Source Type | Document Title / Record | Date | URL / Location | Hash / Ref | Data Extracted | Verification Status |
|-----------|-------------|-------------|-------------------------|------|----------------|------------|----------------|---------------------|
| `SRC-JBP-001` | District Administration Jabalpur | Government Official | District Environment Plan — Jabalpur District | 2024-03-15 | `https://jabalpur.nic.in/en/document/district-environment-plan/` | `sha256:d8a9f...32b1` | MSW daily generation (~450-500 TPD), Kathonda site area (35.4 ha), legacy waste estimate (1.2M tonnes) | `SECONDARY_SOURCE` (Facility verification required) |
| `SRC-JBP-002` | Jabalpur Municipal Corporation (JMC) | Municipal Body | SWM Operational & Facility Register (Kathonda) | 2025-01-10 | `https://jmcjabalpur.org/swm-kathonda` | `sha256:a12e9...7f4c` | Landfill owner (JMC), location coordinates (23.2183° N, 79.8972° E), processing plant operator | `PENDING_VERIFICATION` |
| `SRC-JBP-003` | Madhya Pradesh Pollution Control Board (MPPCB) | Environmental Regulator | MPPCB Consent to Operate — Kathonda SWM & Disposal Site | 2025-04-01 | MPPCB Regional Office Jabalpur Archives | `MPPCB-CTO-2025-JBP-088` | Environmental compliance limits, cell status, leachate monitoring mandates | `PENDING_VERIFICATION` |
| `SRC-JBP-004` | Central Pollution Control Board (CPCB) | National Regulator | Annual Report on Solid Waste Management in Madhya Pradesh | 2024-11-30 | `https://cpcb.nic.in/uploads/MSW/MSW_AnnualReport_MP.pdf` | `sha256:c73d2...10ea` | MP State waste composition averages (48% organic, 38% moisture) | `SECONDARY_SOURCE` |
| `SRC-JBP-005` | Bureau of Energy Efficiency (BEE) | Carbon Regulator | CCTS Offset Methodology BM WA03.001 | 2025-06-01 | `https://beeindia.gov.in/ccts/methodologies/BM-WA03-001` | `sha256:e3b0c...855` | Applicability criteria, formula equations, baseline oxidation factor (0.10) | `PRIMARY_AUTHORITATIVE` |

---

## Data Source Protocol
1. **Primary Facility Data**: Only direct weighbridge logs, NABL-calibrated meter telemetry, and signed JMC facility contracts qualify as `PRIMARY_VERIFIED`.
2. **Secondary Government Data**: District Environment Plans and CPCB reports are cataloged as `SECONDARY_SOURCE`. They provide baseline context but CANNOT directly enter deterministic carbon calculations without facility-level verification.
3. **Data Gaps**: Any parameter lacking documentary evidence is explicitly assigned `PENDING_VERIFICATION` or `DATA_GAP`.
