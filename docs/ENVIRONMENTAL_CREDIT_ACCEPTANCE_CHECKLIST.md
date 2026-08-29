# Environmental Credit Acceptance Checklist

This checklist is the release gate for RupayKg's CCC and Green Credit custody/marketplace model.

## CCC — BEE / ICM

- [ ] RupayKg's authoritative ICM account is configured.
- [ ] Issued CCC reference/serial data is obtained from the authoritative registry.
- [ ] Holder identity is confirmed as RupayKg before custody is recorded.
- [ ] Tradability is confirmed before marketplace listing.
- [ ] Sale transfer uses the authoritative registry transfer mechanism.
- [ ] Buyer account/eligibility is verified before transfer.
- [ ] Post-transfer registry balance reconciles to RupayKg inventory.

## Green Credit — GCP / ICFRE

- [ ] Applicable Green Credit programme account/identity is configured.
- [ ] Issued Green Credit reference/certificate data is obtained from the authoritative programme registry.
- [ ] Holder identity is confirmed before custody is recorded.
- [ ] Applicable transfer/trading eligibility is confirmed before listing.
- [ ] Buyer eligibility and authorised transfer mechanism are verified.
- [ ] Post-transfer balance reconciles to RupayKg inventory.

## Common platform controls

- [ ] No synthetic credit issuance.
- [ ] No marketplace inventory without authoritative evidence.
- [ ] Atomic PostgreSQL quantity changes.
- [ ] Immutable audit trail for custody, reservation, transfer and retirement.
- [ ] Hedera is used only as provenance/evidence, never as a substitute for the authoritative registry.
- [ ] Existing commercial sale waterfall remains separate from credit ownership.
- [ ] Full regression, security and production certification suites pass.

## Release rule

A credit may be displayed as **Held** only after authoritative holder evidence. A credit may be displayed as **Available for Sale** only after authoritative tradability evidence. A sale is not complete until the applicable authoritative registry transfer is confirmed.
