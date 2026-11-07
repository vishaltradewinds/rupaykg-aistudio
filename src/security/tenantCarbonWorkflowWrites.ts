import { sql } from 'drizzle-orm';
import type { TenantRequest } from './tenantContext.ts';
import { withTenantTransaction } from './tenantContext.ts';

export async function createProjectActivity(req: TenantRequest, projectId: string, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const project = await tx.execute(sql`
      SELECT id FROM public.carbon_projects
      WHERE id = ${projectId}::uuid AND organization_id = ${tenant.organizationId}::uuid
      LIMIT 1
    `);
    if (project.length !== 1) return null;
    const rows = await tx.execute(sql`
      INSERT INTO public.activities
        (organization_id, actor_identity_id, activity_type, status, occurred_at, metadata, idempotency_key, captured_at, device_id)
      VALUES
        (${tenant.organizationId}::uuid, ${tenant.identityId}::uuid, ${String(input.activityType || 'MRV_ACTIVITY')},
         'DRAFT', ${input.occurredAt ? new Date(input.occurredAt) : null},
         ${JSON.stringify({ ...(input.metadata || {}), carbonProjectId: projectId })}::jsonb,
         ${input.idempotencyKey || null}, ${input.capturedAt ? new Date(input.capturedAt) : null}, ${input.deviceId || null})
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function createProjectMeasurement(req: TenantRequest, projectId: string, activityId: string, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const activity = await tx.execute(sql`
      SELECT a.id FROM public.activities a
      WHERE a.id = ${activityId}::uuid
        AND a.organization_id = ${tenant.organizationId}::uuid
        AND a.metadata->>'carbonProjectId' = ${projectId}
      LIMIT 1
    `);
    if (activity.length !== 1) return null;
    const rows = await tx.execute(sql`
      INSERT INTO public.measurements
        (activity_id, value, unit, method, source, measured_at, quality_status, metadata,
         captured_by_identity_id, device_id, latitude, longitude, location_accuracy_m)
      VALUES
        (${activityId}::uuid, ${input.value}, ${String(input.unit)}, ${String(input.method)},
         ${String(input.source)}, ${new Date(input.measuredAt)}, 'PENDING',
         ${JSON.stringify(input.metadata || {})}::jsonb, ${tenant.identityId}::uuid,
         ${input.deviceId || null}, ${input.latitude ?? null}, ${input.longitude ?? null},
         ${input.locationAccuracyM ?? null})
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function createProjectEvidence(req: TenantRequest, projectId: string, activityId: string, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const activity = await tx.execute(sql`
      SELECT a.id FROM public.activities a
      WHERE a.id = ${activityId}::uuid
        AND a.organization_id = ${tenant.organizationId}::uuid
        AND a.metadata->>'carbonProjectId' = ${projectId}
      LIMIT 1
    `);
    if (activity.length !== 1) return null;
    const rows = await tx.execute(sql`
      INSERT INTO public.evidence
        (activity_id, measurement_id, evidence_type, status, captured_at, content_uri, content_hash,
         metadata, captured_by_identity_id, device_id, evidence_hash_algorithm)
      VALUES
        (${activityId}::uuid, ${input.measurementId || null}::uuid, ${String(input.evidenceType)},
         'CAPTURED', ${new Date(input.capturedAt || new Date().toISOString())},
         ${input.contentUri || null}, ${input.contentHash || null},
         ${JSON.stringify(input.metadata || {})}::jsonb, ${tenant.identityId}::uuid,
         ${input.deviceId || null}, 'sha256')
      RETURNING *
    `);
    return rows[0] || null;
  });
}

export async function createProjectCalculation(req: TenantRequest, projectId: string, activityId: string, input: any) {
  const tenant = req.tenant;
  if (!tenant) return null;
  return withTenantTransaction(tenant, async (tx) => {
    const activity = await tx.execute(sql`
      SELECT a.id FROM public.activities a
      WHERE a.id = ${activityId}::uuid
        AND a.organization_id = ${tenant.organizationId}::uuid
        AND a.metadata->>'carbonProjectId' = ${projectId}
      LIMIT 1
    `);
    if (activity.length !== 1) return null;
    const rows = await tx.execute(sql`
      INSERT INTO public.carbon_calculations
        (activity_id, methodology_version_id, inputs, result, unit, status, calculated_at,
         carbon_project_id, baseline_result, uncertainty, calculation_hash, dataset_hash,
         formula_hash, calculation_trace, provenance_version, carbon_mechanism, regulatory_source_id)
      VALUES
        (${activityId}::uuid, ${input.methodologyVersionId}::uuid, ${JSON.stringify(input.inputs || {})}::jsonb,
         ${input.result ?? null}, ${input.unit || null}, 'DRAFT',
         ${input.calculatedAt ? new Date(input.calculatedAt) : new Date()},
         ${projectId}::uuid, ${input.baselineResult ?? null}, ${input.uncertainty ?? null},
         ${input.calculationHash || null}, ${input.datasetHash || null}, ${input.formulaHash || null},
         ${JSON.stringify(input.calculationTrace || [])}::jsonb, ${input.provenanceVersion || '1'},
         ${input.carbonMechanism || 'OFFSET'}, ${input.regulatorySourceId || null}::uuid)
      RETURNING *
    `);
    return rows[0] || null;
  });
}
