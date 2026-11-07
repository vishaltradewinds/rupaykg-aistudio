import { sql } from 'drizzle-orm';
import type { Response, NextFunction } from 'express';
import type { TenantRequest } from './tenantContext.ts';
import { resolveTenantContext, withTenantTransaction } from './tenantContext.ts';

export interface AuthoritativeCarbonProject {
  id: string; organizationId: string; geographyId: string | null; projectCode: string;
  title: string; methodologyVersionId: string; status: string; createdAt: string;
  carbonMechanism: string; regulatorySourceId: string | null;
}

function mapProject(row: any): AuthoritativeCarbonProject {
  return { id: String(row.id), organizationId: String(row.organization_id),
    geographyId: row.geography_id ? String(row.geography_id) : null,
    projectCode: String(row.project_code), title: String(row.title),
    methodologyVersionId: String(row.methodology_version_id), status: String(row.status),
    createdAt: new Date(row.created_at).toISOString(), carbonMechanism: String(row.carbon_mechanism),
    regulatorySourceId: row.regulatory_source_id ? String(row.regulatory_source_id) : null };
}

export async function listTenantCarbonProjects(req: TenantRequest): Promise<AuthoritativeCarbonProject[]> {
  if (!req.tenant) throw new Error('Tenant context required');
  return withTenantTransaction(req.tenant, async (tx) => {
    const rows = await tx.execute(sql`SELECT id, organization_id, geography_id, project_code, title, methodology_version_id, status, created_at, carbon_mechanism, regulatory_source_id FROM public.carbon_projects WHERE organization_id = ${req.tenant!.organizationId}::uuid ORDER BY created_at DESC`);
    return rows.map(mapProject);
  });
}

export async function createTenantCarbonProject(req: TenantRequest, input: any): Promise<AuthoritativeCarbonProject> {
  if (!req.tenant) throw new Error('Tenant context required');
  const title = String(input.title ?? input.name ?? '').trim();
  const methodologyVersionId = String(input.methodologyVersionId ?? '').trim();
  if (!title) throw new Error('Project title is required');
  if (!methodologyVersionId) throw new Error('methodologyVersionId is required and must reference an authoritative methodology version');
  const projectCode = String(input.projectCode ?? `RKG-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`).trim();
  const carbonMechanism = String(input.carbonMechanism ?? 'OFFSET').trim();
  return withTenantTransaction(req.tenant, async (tx) => {
    const rows = await tx.execute(sql`INSERT INTO public.carbon_projects (organization_id, geography_id, project_code, title, methodology_version_id, status, carbon_mechanism, regulatory_source_id) VALUES (${req.tenant!.organizationId}::uuid, ${input.geographyId ? String(input.geographyId) : null}::uuid, ${projectCode}, ${title}, ${methodologyVersionId}::uuid, 'DRAFT', ${carbonMechanism}, ${input.regulatorySourceId ? String(input.regulatorySourceId) : null}::uuid) RETURNING id, organization_id, geography_id, project_code, title, methodology_version_id, status, created_at, carbon_mechanism, regulatory_source_id`);
    if (!rows.length) throw new Error('Project creation returned no row');
    return mapProject(rows[0]);
  });
}

export async function getTenantCarbonProject(req: TenantRequest, projectId: string): Promise<AuthoritativeCarbonProject | null> {
  if (!req.tenant) throw new Error('Tenant context required');
  return withTenantTransaction(req.tenant, async (tx) => {
    const rows = await tx.execute(sql`SELECT id, organization_id, geography_id, project_code, title, methodology_version_id, status, created_at, carbon_mechanism, regulatory_source_id FROM public.carbon_projects WHERE id = ${projectId}::uuid AND organization_id = ${req.tenant!.organizationId}::uuid LIMIT 1`);
    return rows.length ? mapProject(rows[0]) : null;
  });
}

export async function requireTenantCarbonProject(req: TenantRequest, res: Response, next: NextFunction) {
  try {
    const context = await resolveTenantContext(req);
    if (!context) return res.status(403).json({ error: 'Tenant context required', code: 'TENANT_CONTEXT_UNRESOLVED' });
    req.tenant = context;
    const projectId = String(req.params.id || '').trim();
    if (!projectId) return res.status(400).json({ error: 'Project id required' });
    const project = await getTenantCarbonProject(req, projectId);
    if (!project) return res.status(404).json({ error: 'Project not found in authorized organization scope' });
    (req as any).tenantProject = project;
    next();
  } catch {
    return res.status(503).json({ error: 'Tenant project authorization unavailable', code: 'TENANT_PROJECT_AUTHORIZATION_UNAVAILABLE' });
  }
}