# RupayKg RLS Rehearsal Gate — 2026-11-07

## Purpose
Define the exact acceptance gate before any production RLS enablement.

## Preconditions
- G-002 migration authority reconciled.
- Live schema baseline frozen and hash recorded.
- Application runtime DB role identified.
- Runtime role is `NOBYPASSRLS` and least privilege.
- Organization identity propagation mechanism is deterministic and fail-closed.
- Tenant relationship graph reviewed.

## Rehearsal tests
For at least two isolated organizations A and B:

1. A can SELECT its direct tenant rows.
2. A cannot SELECT B rows.
3. A cannot INSERT a row attributed to B.
4. A cannot UPDATE an existing B row.
5. A cannot DELETE a B row.
6. A cannot reach B through indirect FK-linked resources.
7. Missing organization context fails closed.
8. Invalid organization context fails closed.
9. Platform-authorized workflows behave as explicitly designed.
10. Background jobs do not silently bypass tenant controls.
11. Verification/audit workflows preserve evidence visibility without exposing unrelated tenant data.
12. CI executes the isolation suite on every authorization-policy change.

## Safety
No production RLS mutation is authorized by this document. The rehearsal must run on a production-derived Neon branch first.

## Acceptance
The gate passes only when the test evidence demonstrates both positive access and negative cross-tenant isolation. A green unit-test suite alone is insufficient.
