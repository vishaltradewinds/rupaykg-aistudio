# RupayKg Production Runtime Role Security Gate — 2026-11-07

## Live evidence
Production Neon database `rupaykg` currently exposes three LOGIN roles:

| Role | SUPERUSER | CREATEROLE | CREATEDB | REPLICATION | BYPASSRLS |
|---|---:|---:|---:|---:|---:|
| cloud_admin | yes | yes | yes | yes | yes |
| neon_service | no | yes | yes | yes | yes |
| rupaykg | no | yes | yes | yes | yes |

This means every currently observed LOGIN role bypasses RLS. PostgreSQL documents that superusers and roles with `BYPASSRLS` bypass row-security policies. citeturn811488search2turn811488search10

## Gate consequence
RLS cannot be treated as an effective tenant-isolation control until the application runtime connection role is identified and a non-BYPASSRLS runtime role is established and tested.

No role mutation was performed.

## Required remediation sequence
1. Identify the actual application runtime DB role from deployment configuration without exposing credentials.
2. Create/select a dedicated least-privilege runtime role with `NOBYPASSRLS`.
3. Grant only required schema/table/sequence/function privileges.
4. Keep migration/admin authority separate from runtime access.
5. Rehearse RLS using the runtime role on a Neon branch.
6. Test cross-organization SELECT/INSERT/UPDATE/DELETE and indirect relationship paths.
7. Verify background workers, verification services and system operations separately.
8. Promote to production only after CI and rehearsal evidence pass.

## Shakti determination
**G-002 remains BLOCKING.** The current role posture is a material security prerequisite, not a reason to enable RLS immediately. The correct sequence is identity of runtime role → least privilege → RLS rehearsal → isolation evidence → controlled production rollout.
