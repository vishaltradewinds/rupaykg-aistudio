import { sql } from 'drizzle-orm';
import type { TenantRequest } from './tenantContext.ts';
import { withTenantTransaction } from './tenantContext.ts';

export async function createTenantClaim(req: TenantRequest, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const activity = await tx.execute(sql`
      SELECT a.id FROM public.activities a
      WHERE a.id = ${String(input.activityId)}::uuid
        AND a.organization_id = ${tenant.organizationId}::uuid
        AND a.metadata->>'carbonProjectId' IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.carbon_projects cp
          WHERE cp.id::text = a.metadata->>'carbonProjectId'
            AND cp.organization_id = ${tenant.organizationId}::uuid
        )
      LIMIT 1
    `);
    if (activity.length !== 1) return null;
    const verification = input.verificationId ? await tx.execute(sql`
      SELECT id FROM public.verifications
      WHERE id = ${String(input.verificationId)}::uuid AND activity_id = ${String(input.activityId)}::uuid
        AND verifier_identity_id IN (
          SELECT id FROM public.identities WHERE id = verifier_identity_id
        )
      LIMIT 1
    `) : [];
    if (input.verificationId && verification.length !== 1) return null;

    const rows = await tx.execute(sql`
      INSERT INTO public.environmental_attribute_claims
        (organization_id, activity_id, evidence_id, verification_id, claim_type, framework_code,
         mechanism_code, claim_quantity, claim_unit, basis_key, consumption_mode, source_type,
         source_id, status, metadata)
      VALUES
        (${tenant.organizationId}::uuid, ${String(input.activityId)}::uuid,
         ${input.evidenceId || null}::uuid, ${input.verificationId || null}::uuid,
         ${String(input.claimType)}, ${String(input.frameworkCode)},
         ${input.mechanismCode || null}, ${input.claimQuantity}, ${String(input.claimUnit)},
         ${String(input.basisKey)}, ${String(input.consumptionMode)}, ${String(input.sourceType)},
         ${String(input.sourceId)}::uuid, 'ACTIVE', ${JSON.stringify(input.metadata || {})}::jsonb)
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function listTenantClaims(req: TenantRequest, activityId: string) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => tx.execute(sql`
    SELECT c.* FROM public.environmental_attribute_claims c
    JOIN public.activities a ON a.id = c.activity_id
    WHERE c.organization_id = ${tenant.organizationId}::uuid
      AND c.activity_id = ${activityId}::uuid
      AND a.organization_id = ${tenant.organizationId}::uuid
    ORDER BY c.created_at DESC
  `));
}

export async function createTenantCredential(req: TenantRequest, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const activity = await tx.execute(sql`
      SELECT id FROM public.activities
      WHERE id = ${String(input.activityId)}::uuid
        AND organization_id = ${tenant.organizationId}::uuid
        AND metadata->>'carbonProjectId' IS NOT NULL
        AND EXISTS (
          SELECT 1 FROM public.carbon_projects cp
          WHERE cp.id::text = metadata->>'carbonProjectId'
            AND cp.organization_id = ${tenant.organizationId}::uuid
        )
      LIMIT 1
    `);
    if (activity.length !== 1) return null;
    const rows = await tx.execute(sql`
      INSERT INTO public.credentials
        (activity_id, issuer_organization_id, trust_root_id, status, credential_uri,
         issued_at, verification_id, methodology_version_id, quantity, unit)
      VALUES
        (${String(input.activityId)}::uuid, ${tenant.organizationId}::uuid,
         ${String(input.trustRootId)}, ${String(input.status || 'ELIGIBLE')}::lifecycle_status,
         ${input.credentialUri || null}, ${input.issuedAt ? new Date(input.issuedAt) : null},
         ${input.verificationId || null}::uuid, ${input.methodologyVersionId || null}::uuid,
         ${input.quantity ?? null}, ${input.unit || null})
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function listTenantCredentials(req: TenantRequest, activityId: string) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => tx.execute(sql`
    SELECT c.* FROM public.credentials c
    JOIN public.activities a ON a.id = c.activity_id
    WHERE c.issuer_organization_id = ${tenant.organizationId}::uuid
      AND c.activity_id = ${activityId}::uuid
      AND a.organization_id = ${tenant.organizationId}::uuid
    ORDER BY c.issued_at DESC NULLS LAST
  `));
}
