import fs from 'fs';

const service = fs.readFileSync('src/security/tenantCarbonProject.ts', 'utf8');
const routes = fs.readFileSync('src/routes/carbon.ts', 'utf8');

const requiredServiceTokens = [
  'public.carbon_projects', 'organization_id', 'methodology_version_id',
  'withTenantTransaction', 'resolveTenantContext',
];
for (const token of requiredServiceTokens) if (!service.includes(token)) throw new Error(`Missing authoritative tenant project token: ${token}`);
if (service.includes('ownerId') || service.includes('organization_name')) throw new Error('Tenant project service contains legacy authorization boundary');
if (!routes.includes("requireTenantContext, async (req, res) =>")) throw new Error('Project list route is not tenant-gated');
if (!routes.includes("carbonRouter.use('/projects/:id', requireTenantCarbonProject)")) throw new Error('Project child-route tenant gate is missing');
if (routes.includes('carbon_projects.ownerId')) throw new Error('Legacy carbon project ownerId query remains in carbon routes');
console.log('tenant carbon project contract: PASS');