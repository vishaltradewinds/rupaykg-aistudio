import type { Response } from 'express';
import type { TenantRequest } from './tenantContext.ts';

export function rejectLegacyWorkflow(req: TenantRequest, res: Response) {
  if (!req.tenant) {
    return res.status(403).json({
      error: 'Tenant context required',
      code: 'TENANT_CONTEXT_UNRESOLVED'
    });
  }
  return res.status(409).json({
    error: 'Legacy workflow endpoint is disabled pending live-schema replacement',
    code: 'LEGACY_WORKFLOW_NOT_AUTHORITATIVE',
    remediation: 'Use the authoritative live MRV workflow endpoints backed by activities, measurements, evidence, verifications, and carbon_calculations.'
  });
}
