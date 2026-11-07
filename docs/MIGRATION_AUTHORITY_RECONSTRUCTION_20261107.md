# RupayKg Migration Authority Reconstruction — 2026-11-07

## Purpose

Resolve G-002 before any production schema mutation. This document records the evidence recovered from the live Neon database and historical GitHub branches/commits and defines the safe migration-authority decision path.

## Live production evidence

Authoritative live Neon project inspected:

- Project: `rupaykg-production-fresh`
- Project ID: `steep-mud-79906940`
- Primary branch: `main`
- Branch ID: `br-restless-base-b44cip2h`
- Database: `rupaykg`
- PostgreSQL: 18
- Public base tables: 67
- `public.schema_migrations`: 92 rows
- `drizzle.__drizzle_migrations`: absent
- `public` RLS policies: 0
- All inspected public tables currently have RLS disabled and not forced.
- Database role `rupaykg` has `rolbypassrls=true` and elevated role capabilities.

The production migration ledger contains versions 001–087, then 20261018–20261021, then 096. The ledger is internally ordered by application time and is therefore preserved as immutable production evidence.

## Recovered production ledger

| Range | Evidence |
|---|---|
| 001–010 | Core, regulatory, identity, security, carbon/EPR/ESG, registry, MRV, verification and field-sync foundations |
| 011–020 | Field-sync application, geography authorization, settlement controls, Guardian/Hedera MRV, device enrollment/provenance, mutation permissions, reconciliation, carbon calculation provenance |
| 021–030 | Methodology governance, provenance integrity, lifecycle guards, regulatory-source provenance, verification hardening, stakeholder onboarding, role defaults |
| 031–040 | Settlement authorization/lifecycle, tenant integrity, device binding, CPCB/EPR baseline, BWG reporting/registration, India regulatory requirements/extensions |
| 041–050 | High-risk permissions, regulatory catalog, BWG invariants, Guardian MRV provenance, EPR allocation, settlement/credential/geography integrity, conflict audit |
| 051–060 | Registry transfer integrity, stakeholder approvals, authoritative regulatory baseline, circular-economy/carbon baseline, market mechanisms, environmental attributes, BRSR |
| 061–070 | BRSR projection, onboarding governance, organization legal verification, statutory applicability, governance cleanup, EPR scheme/lifecycle/evidence/obligations |
| 071–080 | EPR return binding/external references, settlement integrity, stakeholder hierarchy/approval separation, native password auth, geography timestamps |
| 081–087 | Acceptance-fixture geography, super-admin identity governance, MRV mirror-node gate, audit-chain head, dual-control access, reserved-role DB guard, fixture registry exclusion |
| 20261018 | CPCB SWM stakeholder workspaces |
| 20261019 | CPCB BWG workflow tracking |
| 20261020 | CCTS methodology registry |
| 20261021 | Evidence artifact vault |
| 096 | Verification authorization provenance |

## Historical repository evidence recovered

Historical GitHub branches contain an earlier Drizzle migration lineage that is no longer present on current `main`.

### Freeze branch

Branch:

`freeze/rupaykg-enterprise-3.0-post-consolidation-20260830`

Recovered:

- `drizzle/meta/_journal.json`
- `drizzle/0000_sloppy_misty_knight.sql`
- `drizzle/0001_gcp_commercial_lifecycle_ledger.sql`
- `drizzle/0002_environmental_credit_custody.sql`
- `drizzle/meta/0000_snapshot.json`

The recovered journal has three entries:

1. `0000_sloppy_misty_knight`
2. `0001_gcp_commercial_lifecycle_ledger`
3. `0002_environmental_credit_custody`

The freeze branch's `0000` migration contains a large consolidated schema foundation, including core carbon, compliance, MRV, ACVA, evidence, methodology, stakeholder and registry structures.

### Environmental-credit branch

Branch:

`feat/environmental-credit-depository`

Recovered:

- `drizzle/meta/_journal.json` with `0000_sloppy_misty_knight`
- `src/db/migrations/meta/_journal.json` with an older `0000_regular_cloak`
- `src/db/migrations/0000_regular_cloak.sql`

This proves the repository historically contained multiple migration lineages and that later cleanup explicitly removed duplicate/obsolete migration journals and trees.

### Cleanup commits

Recovered commits include:

- `eeca8f1ffb9468c3c57ed5cc68065d37f4c4fee6` — removed obsolete duplicate migration journal.
- `139994dd162063b3c4885a76656c1985181a443e` — removed obsolete duplicate migration tree.
- `7ad04629d52135b8400dc8f9c48fef8875eff3d4` — removed obsolete duplicate migration metadata.
- `49068946b4d6d4ebac37cdbcb09841319e0c1c43` — consolidated migration runner imports and retained a custom runner that creates/uses `drizzle.__drizzle_migrations`.
- `a872adac4ceb675e158ef46acacbfcab2dc60ebb` — aligned migration connection configuration with production.

These historical artifacts establish that the current two-entry Drizzle journal is not sufficient evidence of the full production 92-migration history.

## Determination

The earlier finding is upgraded from “migration parity unproven” to:

**G-002 = BLOCKING / FAIL / OPEN**

There are two different migration histories:

1. The live production database's 92-row `public.schema_migrations` ledger.
2. The current repository's two-entry Drizzle journal.

The historical GitHub evidence demonstrates that repository migration assets were consolidated and obsolete migration trees/journals were deliberately removed. Therefore, reconstructing the exact 001–096 SQL sequence from current `main` alone is not possible.

## Safe authority decision

Do **not**:

- create `drizzle.__drizzle_migrations` in production merely to make the current runner appear consistent;
- delete or rewrite `public.schema_migrations`;
- mark the 92 production migrations as equivalent to the two current Drizzle entries;
- run new schema migrations;
- enable RLS blindly across all 67 tables.

The production ledger remains immutable evidence.

The next canonicalization step is to establish a **single forward migration authority** using:

1. the live production schema as the current structural baseline;
2. the preserved 92-row production ledger as historical execution evidence;
3. recoverable historical SQL where available;
4. a new, explicit baseline migration/snapshot for future forward migrations;
5. CI checks that prevent divergence between repository schema and the authoritative live schema.

This is a controlled baseline reconstruction, not a claim that the missing historical SQL has been recovered.

## Required acceptance gates before G-002 can close

- [ ] Production schema snapshot captured and hashed.
- [ ] 92-row production ledger preserved in repository evidence.
- [ ] Historical migration SQL recovered wherever actually available.
- [ ] Missing historical SQL explicitly inventoried rather than fabricated.
- [ ] One canonical forward migration system selected.
- [ ] Repository baseline represents the live schema without destructive reset.
- [ ] Migration runner no longer depends on an unverified historical journal.
- [ ] CI schema/migration parity check implemented.
- [ ] Production runtime target verified against the same Neon database.
- [ ] Only after the above: tenant-scoped RLS design and least-privilege runtime role remediation.

## Shakti control

No production certification, TRL-9 claim, tenant-isolation claim, or regulatory-readiness claim may be advanced solely from this reconstruction.

The objective is to make the database state reproducible, auditable and safely evolvable first.
