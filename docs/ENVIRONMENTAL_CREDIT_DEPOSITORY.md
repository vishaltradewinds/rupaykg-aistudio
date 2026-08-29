# RupayKg Environmental Credit Depository

## Governing model

RupayKg is an MRV/origination, custody and marketplace layer. It does **not** issue CCCs or Green Credits.

- CCC issuance remains with the applicable BEE / ICM process.
- Green Credit issuance remains with the applicable Green Credit Programme / ICFRE process.
- RupayKg records a custody position only after authoritative registry evidence identifies RupayKg as holder and establishes tradability.
- A local identifier, hash, or Hedera transaction is evidence/provenance; it is not a substitute for the authoritative registry record.

## Lifecycle

`MRV → applicable methodology → ACVA/GCP verification → authoritative issuance → RupayKg holding → marketplace reservation → authorised transfer → buyer account`

## Ownership vs revenue

Credit ownership/custody is independent of the existing sale-proceeds waterfall. The existing commercial waterfall is preserved and applies to gross sale proceeds only:

- 1.0% payment rails / settlement
- 1.5% registry / compliance
- 2.5% ACVA/VVB reserve
- 35.0% project owner / ULB / concessionaire
- 5.0% generator / aggregator / community
- 2.0% financier
- 53.0% RupayKg treasury

These percentages are treated as the platform's contractual/commercial waterfall unless a separate authoritative legal instrument expressly establishes a different mandatory rate. They must not be presented as government-mandated percentages without supporting authority.

## Marketplace invariants

1. No synthetic issuance.
2. No listing without authoritative registry reference and confirmed holder.
3. No listing of non-tradable or unknown-tradability credits.
4. No reservation above available custody quantity.
5. Transfers must reconcile with the authoritative registry mechanism.
6. Retirement permanently reduces available inventory.
7. Ownership/custody and sale proceeds are separate ledgers.
8. All quantity-changing operations must be atomic and auditable in PostgreSQL.
