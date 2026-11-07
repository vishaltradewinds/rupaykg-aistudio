import { sql } from 'drizzle-orm';
import type { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.ts';

export interface TenantContext { identityId: string; organizationId: string; membershipId: string; roleId: string; }
export interface TenantRequest extends Request { tenant?: TenantContext; }
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requestedOrganizationId(req: Request): string | null {
  const raw = req.headers['x-organization-id'];
  if (typeof raw !== 'string' || !UUID_RE.test(raw.trim())) return null;
  return raw.trim();
}

export async function resolveTenantContext(req: Request): Promise<TenantContext | null> {
  const subject = String((req as any).user?.uid || (req as any).user?.id || '').trim();
  if (!subject) return null;
  const requestedOrg = requestedOrganizationId(req);
  const rows = await db.execute(sql`SELECT i.id AS identity_id, om.id AS membership_id, om.organization_id, om.role_id FROM public.identities i JOIN public.organization_memberships om ON om.identity_id = i.id JOIN public.organizations o ON o.id = om.organization_id WHERE i.external_subject = ${subject} AND i.status = 'ACTIVE' AND om.status = 'ACTIVE' AND o.status = 'ACTIVE' ${requestedOrg ? sql`AND om.organization_id = ${requestedOrg}::uuid` : sql``} ORDER BY om.created_at ASC`);
  if (rows.length !== 1) return null;
  const row = rows[0] as any;
  return { identityId: String(row.identity_id), organizationId: String(row.organization_id), membershipId: String(row.membership_id), roleId: String(row.role_id) };
}

export async function attachTenantContext(req: TenantRequest): Promise<TenantContext | null> {
  try {
    const context = await resolveTenantContext(req);
    if (context) req.tenant = context;
    return context;
  } catch {
    return null;
  }
}

export async function requireTenantContext(req: TenantRequest, res: Response, next: NextFunction) {
  try {
    const context = await resolveTenantContext(req);
    if (!context) return res.status(403).json({ error: 'Tenant context required', code: 'TENANT_CONTEXT_UNRESOLVED' });
    req.tenant = context; next();
  } catch {
    return res.status(503).json({ error: 'Tenant authorization service unavailable', code: 'TENANT_AUTHORIZATION_UNAVAILABLE' });
  }
}

export async function withTenantTransaction<T>(context: TenantContext, fn: (tx: any) => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.organization_id', ${context.organizationId}, true)`);
    await tx.execute(sql`SELECT set_config('app.identity_id', ${context.identityId}, true)`);
    return fn(tx);
  });
}