# Phase 4 Database Audit Report

## Schema & Migration Integrity
- **ORM / Driver**: Drizzle ORM over PostgreSQL & PostGIS (`pg`).
- **Migration Files**:
  - `drizzle/0000_big_the_hunter.sql`
  - `src/db/migrations/0000_regular_cloak.sql`
- **Migration Status**: Verified repeatable. Schema definitions in `src/db/schema.ts` match SQL DDL snapshots cleanly.

## Carbon OS Tables Summary
1. `carbon_projects`: Primary registry for CCTS methodologies and project operational bounds.
2. `facilities`: Physical facility records linked to organizational domains.
3. `methodologies`: BEE official methodology catalog (`BM WA03.001`, `BM WA03.002`, `BM-T-011`).
4. `methodology_versions`: Version-controlled parameters and equation references.
5. `methodology_parameters`: Canonical unit requirements and expected ranges.
6. `monitoring_periods`: Time-bounded verification windows.
7. `instruments`: Hardware sensors (flow meters, thermocouples, methane analyzers).
8. `calibrations`: Instrument calibration logs with strict expiration enforcement.
9. `measurements`: Raw physical telemetry readings.
10. `evidence`: Immutable cryptographic evidence vault with SHA-256 content hashes.
11. `calculation_datasets`: Immutable parameter snapshots for formula inputs.
12. `calculation_runs`: Deterministic carbon credit outputs bound to dataset and formula hashes.
13. `pdd` & `pdd_versions`: Project Design Documents with auto-populated parameters.
14. `acva_cases` & `findings`: Third-party auditing case management and CAR tracking.
15. `carbon_claims`: Non-double-counted claim records.
16. `certificates`: CCTS Credit Certificate lifecycle manager.
17. `weighbridge_records`: Physical ticket weight logs from waste entry gates.
18. `landfill_facilities`: Cell layout and gas capture operational metadata.
19. `waste_deposition_history`: Annual waste composition and tonnage history for FOD decay.
20. `gas_meter_readings`: Raw gas volume, temperature, and pressure telemetry.
21. `methane_measurements`: Analyzer fraction readings.
22. `electricity_meter_readings`: MWh generation, export, and consumption logs.

## Constraints & Referential Integrity
- **Primary Keys**: UUID / auto-generated UUIDs across physical and carbon ledgers.
- **Foreign Keys**: Foreign key constraints enforced across all project, facility, instrument, measurement, and evidence relationships.
- **Indexes**: Default index coverage on primary and foreign keys.

## Rollback & Safety Strategy
- Drizzle Kit snapshot journaling enabled in `drizzle/meta/` and `src/db/migrations/meta/`.
- No destructive drops permitted on legacy RupayKg tables (`users`, `records`, etc.).

## Audit Outcome
Database schema audit **PASSED**.
