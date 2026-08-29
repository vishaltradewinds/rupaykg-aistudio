# Environmental Credit Integration Specification — RupayKg Enterprise 3.0

## Scope

This specification is the implementation boundary for the environmental-credit depository and marketplace. It is intentionally registry-agnostic at the transport layer because the authoritative transfer APIs/accounts must be configured from the applicable live programme.

## Canonical lifecycle

MRV evidence → applicable methodology → ACVA / programme verification → authoritative issuance → authoritative holder confirmation → RupayKg custody → marketplace listing → atomic reservation → buyer eligibility → authoritative transfer → reconciliation → retirement.

## Credit types

- CCC: issued by the applicable BEE / Indian Carbon Market process. RupayKg is not the issuer.
- Green Credit: issued under the applicable Green Credit Programme process. RupayKg is not the issuer.

## Required persistent entities

### environmental_credit_positions

- id
- credit_type
- authoritative_registry
- registry_account_id
- authoritative_credit_reference
- holder_entity_id
- issued_quantity
- available_quantity
- reserved_quantity
- transferred_quantity
- retired_quantity
- status
- tradability_status
- authoritative_verified_at
- created_at
- updated_at

### environmental_credit_transactions

- id
- position_id
- transaction_type: CUSTODY | RESERVE | RELEASE | TRANSFER | RETIRE | BLOCK | RECONCILE
- quantity
- buyer_entity_id (nullable)
- authoritative_transaction_reference (nullable)
- idempotency_key
- actor_uid
- created_at

## Invariants

`issued = available + reserved + transferred + retired` for every position, subject to the exact semantics of the authoritative registry reconciliation.

A position is marketable only when:

- authoritative holder = RupayKg
- authoritative credit reference exists
- authoritative tradability is confirmed
- status permits listing
- available quantity > 0

Every quantity-changing operation must execute in a PostgreSQL transaction and create an auditable transaction row. Duplicate idempotency keys must not create duplicate transfers/reservations.

## Registry boundary

The platform may cache authoritative registry facts for operational UX, but the cache is not the source of truth for issuance or final transfer. Hedera anchoring is provenance/evidence only and cannot substitute for the applicable registry.

## Existing commercial waterfall

Sale proceeds remain separate from credit ownership. Preserve the current 100% waterfall:

1. 1.0% payment rails / settlement
2. 1.5% registry / compliance
3. 2.5% ACVA / VVB reserve
4. 35.0% project owner / ULB / concessionaire
5. 5.0% generator / aggregator / community
6. 2.0% financier
7. 53.0% RupayKg treasury

The waterfall is a commercial/contractual model unless separately supported by an authoritative legal instrument. Do not label these percentages as Government-mandated without evidence.

## Release gate

No production release of marketplace transfer functionality until live authoritative registry credentials/API mechanisms are configured and end-to-end reconciliation tests pass for both CCC and Green Credit flows.
