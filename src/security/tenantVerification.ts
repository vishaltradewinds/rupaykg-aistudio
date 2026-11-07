import { sql } from 'drizzle-orm';
import type { TenantRequest } from './tenantContext.ts';
import { withTenantTransaction } from './tenantContext.ts';

export interface VerificationInput {
  evidenceId?: string;
  activityId?: string;
  decision: string;
  scope: string;
  rationale?: string;
}

export async function createTenantVerification(req: TenantRequest, input: VerificationInput) {
  const tenant = req.tenant;
  if (!tenant) return null;
  if (!input.activityId && !input.evidenceId) throw new Error('activityId or evidenceId required');

  return withTenantTransaction(tenant, async (tx) => {
    const rows = await tx.execute(sql`
      SELECT a.id AS activity_id
      FROM public.activities a
      LEFT JOIN public.evidence e ON e.activity_id = a.id
      WHERE a.organization_id = ${tenant.organizationId}::uuid
        AND a.metadata->>'carbonProjectId' IS NOT NULL
        AND a.metadata->>'carbonProjectId' = (
          SELECT cp.id::text FROM public.carbon_projects cp
          WHERE cp.organization_id = ${tenant.organizationId}::uuid
          AND cp.id::text = a.metadata->>'carbonProjectId'
          LIMIT 1
        )
        AND a.id = COALESCE(${input.activityId || null}::uuid, e.activity_id)
        AND (${input.evidenceId || null}::uuid IS NULL OR e.id = ${input.evidenceId || null}::uuid)
      LIMIT 1
    `);
    if (rows.length !== 1) return null;

    const result = await tx.execute(sql`
      INSERT INTO public.verifications
        (evidence_id, activity_id, verifier_identity_id, decision, scope, rationale,
         authorization_membership_id, authorization_role_id, authorization_permissions_snapshot,
         authorization_checked_at)
      VALUES
        (${input.evidenceId || null}::uuid, ${String((rows[0] as any).activity_id)}::uuid,
         ${tenant.identityId}::uuid, ${String(input.decision)}::verification_decision,
         ${String(input.scope)}, ${input.rationale || null},
         ${tenant.membershipId}::uuid, ${tenant.roleId}::uuid,
         ${JSON.stringify({ tenantContext: true })}::jsonb, now())
      RETURNING *
    `);
    return result[0] || null;
  });
}

export async function listTenantVerifications(req: TenantRequest, activityId: string) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => tx.execute(sql`
    SELECT v.*
    FROM public.verifications v
    JOIN public.activities a ON a.id = v.activity_id
    WHERE v.activity_id = ${activityId}::uuid
      AND a.organization_id = ${tenant.organizationId}::uuid
      AND a.metadata->>'carbonProjectId' IS NOT NULL
    ORDER BY v.decided_at DESC
  `));
}
