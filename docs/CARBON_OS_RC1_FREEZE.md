# RupayKg Carbon OS RC1 Freeze Documentation

## Frozen Artifacts & Engine Specifications
- **Release Tag**: `carbon-v1.0.0-rc1`
- **Branch**: `feature/rupaykg-carbon-os`
- **Freeze Timestamp**: `2026-08-09T07:20:00Z`

## Deterministic Rules & Principles
1. **Methodology Formulas**: No methodology formula calculations in `packages/methodology/` may be altered without creating a new immutable version entity.
2. **Database Schemas**: Database schema modifications require versioned Drizzle migrations (`drizzle/` and `src/db/migrations/`).
3. **Calculation Immutability**: Calculations are bound to immutable `dataset_hash` and `formula_hash`. Re-runs with altered inputs create versioned datasets ($V_1 \to V_2$).
4. **Source Methodology Registry**: Registry hashes in `packages/methodology/source-registry/registry.json` are frozen against official BEE regulatory documents (`BM WA03.001`, `BM WA03.002`, `BM-T-011`).
5. **Golden Test Fixtures**: Golden fixtures in `src/__tests__/carbonOs.test.ts` must maintain strict mathematical reconciliation.

## Status
Deterministic Engine Freeze: **ENFORCED & ACTIVE**.
