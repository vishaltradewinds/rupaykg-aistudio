import { sql } from 'drizzle-orm';
import { db } from '../db/index.ts';
import { TenantRequest, requireTenantContext, withTenantTransaction } from './tenantContext.ts';

export interface TenantWorkflowScope {
  projectId: string;
  organizationId: string;
}

export async function resolveTenantWorkflowScope(req: TenantRequest, projectId: string): Promise<TenantWorkflowScope | null> {
  const tenant = req.tenant;
  if (!tenant) return null;
  const rows = await db.execute(sql`
    SELECT cp.id, cp.organization_id
    FROM public.carbon_projects cp
    WHERE cp.id = ${projectId}::uuid
      AND cp.organization_id = ${tenant.organizationId}::uuid
    LIMIT 1
  `);
  if (rows.length !== 1) return null;
  return { projectId: String((rows[0] as any).id), organizationId: String((rows[0] as any).organization_id) };
}

export async function listProjectActivities(req: TenantRequest, projectId: string) {
  const scope = await resolveTenantWorkflowScope(req, projectId);
  if (!scope) return null;
  return withTenantTransaction(req.tenant!, async (tx) => tx.execute(sql`
    SELECT a.*
    FROM public.activities a
    WHERE a.organization_id = ${scope.organizationId}::uuid
      AND a.metadata->>'carbonProjectId' = ${scope.projectId}
    ORDER BY a.created_at DESC
  `));
}

export async function listProjectEvidence(req: TenantRequest, projectId: string) {
  const scope = await resolveTenantWorkflowScope(req, projectId);
  if (!scope) return null;
  return withTenantTransaction(req.tenant!, async (tx) => tx.execute(sql`
    SELECT e.*
    FROM public.evidence e
    JOIN public.activities a ON a.id = e.activity_id
    WHERE a.organization_id = ${scope.organizationId}::uuid
      AND a.metadata->>'carbonProjectId' = ${scope.projectId}
    ORDER BY e.captured_at DESC
  `));
}

export async function listProjectCalculations(req: TenantRequest, projectId: string) {
  const scope = await resolveTenantWorkflowScope(req, projectId);
  if (!scope) return null;
  return withTenantTransaction(req.tenant!, async (tx) => tx.execute(sql`
    SELECT cc.*
    FROM public.carbon_calculations cc
    WHERE cc.carbon_project_id = ${scope.projectId}::uuid
      AND EXISTS (
        SELECT 1
        FROM public.activities a
        WHERE a.id = cc.activity_id
          AND a.organization_id = ${scope.organizationId}::uuid
      )
    ORDER BY cc.calculated_at DESC NULLS LAST
  `));
}

export const requireTenantWorkflowContext = requireTenantContext;
