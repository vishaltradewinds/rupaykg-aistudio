# Waste to Carbon Data Lineage

## 1. Physical Source to Measurement
- **Waste Source**: A generator or municipality offloads waste.
- **Weighbridge (Physical)**: 
  - Generates a physical ticket (gross, tare, net).
  - RupayKg `weighbridge_records` table captures the ticket number, vehicle ID, timestamp, net weight, material type, and links it to the original RupayKg `records` transaction.
- **Landfill (Physical)**:
  - Waste is deposited into a landfill cell.
  - RupayKg `waste_deposition_history` logs the tonnage, year, waste type, and parameters (DOC, DOCf, MCF, k) derived from the physical nature of the material.
- **Gas Capture (Physical)**:
  - Landfill gas is captured and metered.
  - RupayKg `gas_meter_readings` captures raw flow, temperature, and pressure from physical flow meters.
  - RupayKg `methane_measurements` captures methane concentration from physical analyzers.

## 2. Measurement to Parameter
- **Gas Flow**: Converted to normalized cubic meters (Nm3) based on temperature and pressure.
- **Methane Mass**: Flow * Methane Fraction * Density of Methane.
- **W_j_x (BM-T-011)**: Aggregated from `waste_deposition_history` for each waste type `j` in year `x`.

## 3. Parameter to Calculation
- All normalized parameters are bundled into a `calculation_datasets` record with a unique SHA-256 hash.
- The `CarbonCalculationEngine` processes the dataset using `WA03_001` or `WA03_002` formulas, resulting in a `calculation_runs` record with a `resultTco2e` and a calculation hash.

## 4. Calculation to Certificate
- **PDD Draft**: `PDDEngine` drafts a Project Design Document embedding the calculations.
- **ACVA Verification**: `ACVABackend` creates a verification request. The auditor traces the calculation hash back to the dataset, and the dataset parameters back to the `evidence_hash` of the `weighbridge_records` and `gas_meter_readings`.
- **Issuance**: Only after ACVA clearance, the `CertificateModel` allows transitioning to the `ISSUED` state.
