# G-002 Runtime Role + RLS Rehearsal Findings — 2026-11-07

## Rehearsal branch

Existing production-derived Neon branch used: `rupaykg-role-split-rehearsal-20261106` (`br-dry-base-b42zrepz`). A new branch could not be created because the project branch limit is already exceeded.

## Role findings

The rehearsal contains:

- `rupaykg`: LOGIN, BYPASSRLS, administrative attributes remain present.
- `rupaykg_runtime_model_20261106`: LOGIN, NOBYPASSRLS, non-administrative attributes.
- `rupaykg_owner_model_20261106`: NOLOGIN, NOBYPASSRLS, intended ownership role.

This confirms that the role-split pattern is technically representable in the production-derived environment without using a BYPASSRLS runtime role.

## Privilege findings

The existing runtime-model role has explicit table ACLs across the production-derived schema. The ACLs are mixed: core operational tables have `arwd` while reference/governance tables have `r`. This is materially better than relying on an administrative/BYPASSRLS runtime identity, but the exact required grant matrix still needs reconciliation against application call paths before production adoption.

The newly created rehearsal-only `rupaykg_runtime_20261107` role is NOBYPASSRLS and non-administrative, but its table privileges are not yet established. It is therefore a test artifact, not a production-ready runtime identity.

## RLS state

The rehearsal schema currently has RLS disabled on inspected public tables. No production RLS change was made.

## Critical conclusion

The role-split rehearsal validates the **identity architecture**, but does not yet validate tenant isolation. RLS policy design and cross-organization test fixtures remain required.

## Next execution batch

1. Derive the exact runtime grant matrix from application queries/mutations.
2. Reconcile the existing runtime-model ACLs against that matrix.
3. Define the trusted organization context mechanism.
4. Implement RLS policies in the rehearsal only.
5. Test organization A/B direct and indirect access.
6. Test missing/invalid tenant context fail-closed.
7. Test platform/system/verification/background workflows.
8. Add CI gate requiring runtime `NOBYPASSRLS` and rejecting administrative runtime roles.
9. Only then prepare production role transition.

## Production status

No production role, table ownership, RLS policy, or application credential was changed in this batch.
