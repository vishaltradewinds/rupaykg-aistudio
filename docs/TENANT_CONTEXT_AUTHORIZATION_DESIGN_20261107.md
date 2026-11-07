# Tenant Context Authorization Design — 2026-11-07

## Authoritative identity path

The application tenant boundary must resolve through:

`authenticated subject -> identities.external_subject -> organization_memberships -> organizations`.

The legacy `users.organization_name` field is not an authorization boundary.

## Fail-closed rules

Tenant-scoped requests are rejected when no authenticated subject exists, the subject has no active identity, the identity has no active organization membership, the user has multiple active memberships without valid organization selection, the requested organization is not an active membership, or tenant authorization lookup is unavailable.

## Multiple-organization users

`X-Organization-Id` may select a tenant, but it is never trusted directly. The database must prove active membership for the authenticated identity.

## RLS boundary

Tenant context must be established inside the same PostgreSQL transaction that performs tenant-scoped reads/writes using transaction-local settings `app.organization_id` and `app.identity_id`. This prevents pooled connections from retaining tenant context between requests.

## Production integration status

The resolver and transaction helper are engineering components on the TRL-9 gap branch. They are not mounted globally and no production RLS policies have been enabled. This is intentional because the ORM/live-schema mismatch must be reconciled before existing routes are converted to tenant-scoped transactions.

## Required tests

1. Exactly one active membership resolves.
2. Multiple active memberships fail closed without explicit organization selection.
3. Valid organization selection resolves.
4. Non-member organization selection fails.
5. Inactive membership fails.
6. Inactive organization fails.
7. Missing identity fails.
8. RLS A/B CRUD tests use the resolved context.
9. Pooled connection testing proves tenant context does not leak between transactions.
