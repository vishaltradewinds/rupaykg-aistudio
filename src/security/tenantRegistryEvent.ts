import { sql } from 'drizzle-orm';
import type { TenantRequest } from './tenantContext.ts';
import { withTenantTransaction } from './tenantContext.ts';

export async function createTenantRegistryEvent(req: TenantRequest, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const credential = await tx.execute(sql`
      SELECT c.id
      FROM public.credentials c
      JOIN public.activities a ON a.id = c.activity_id
      WHERE c.id = ${String(input.credentialId)}::uuid
        AND c.issuer_organization_id = ${tenant.organizationId}::uuid
        AND a.organization_id = ${tenant.organizationId}::uuid
      LIMIT 1
    `);
    if (credential.length !== 1) return null;

    const fromOwnerId = input.fromOwnerId ? String(input.fromOwnerId) : tenant.organizationId;
    const toOwnerId = input.toOwnerId ? String(input.toOwnerId) : tenant.organizationId;
    if (fromOwnerId !== tenant.organizationId) return null;
    const counterparty = await tx.execute(sql`
      SELECT id FROM public.organizations WHERE id = ${toOwnerId}::uuid LIMIT 1
    `);
    if (counterparty.length !== 1) return null;
    if (input.verificationId) {
      const verification = await tx.execute(sql`
        SELECT v.id
        FROM public.verifications v
        JOIN public.activities a ON a.id = v.activity_id
        WHERE v.id = ${String(input.verificationId)}::uuid
          AND a.organization_id = ${tenant.organizationId}::uuid
        LIMIT 1
      `);
      if (verification.length !== 1) return null;
    }
    const rows = await tx.execute(sql`
      INSERT INTO public.registry_events
        (credential_id, event_type, from_owner_id, to_owner_id, external_reference,
         event_hash, verification_id, recorded_by_identity_id)
      VALUES
        (${String(input.credentialId)}::uuid, ${String(input.eventType)},
         ${fromOwnerId}::uuid, ${toOwnerId}::uuid,
         ${input.externalReference || null}, ${String(input.eventHash)},
         ${input.verificationId || null}::uuid, ${tenant.identityId}::uuid)
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function listTenantRegistryEvents(req: TenantRequest, credentialId: string) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => tx.execute(sql`
    SELECT re.*
    FROM public.registry_events re
    JOIN public.credentials c ON c.id = re.credential_id
    WHERE re.credential_id = ${credentialId}::uuid
      AND (c.issuer_organization_id = ${tenant.organizationId}::uuid
           OR re.from_owner_id = ${tenant.organizationId}::uuid
           OR re.to_owner_id = ${tenant.organizationId}::uuid)
    ORDER BY re.created_at DESC
  `));
}
