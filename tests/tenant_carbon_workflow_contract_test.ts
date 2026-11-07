import fs from 'node:fs';

const service = fs.readFileSync('src/security/tenantCarbonWorkflow.ts', 'utf8');
const routes = fs.readFileSync('src/routes/carbon.ts', 'utf8');

const required = [
  'resolveTenantWorkflowScope',
  'withTenantTransaction',
  'public.carbon_projects',
  'organization_id',
  'public.activities',
  'public.evidence',
  'public.carbon_calculations'
];

for (const token of required) {
  if (!service.includes(token)) throw new Error(`Missing tenant workflow control: ${token}`);
}

if (service.includes('organization_name')) throw new Error('Legacy organization_name authorization detected');
if (service.includes('ownerId')) throw new Error('Legacy ownerId authorization detected');
if (!routes.includes('requireTenantCarbonProject')) throw new Error('Parent project tenant gate missing from carbon routes');

console.log('PASS: tenant carbon workflow contract');
