const service = await Bun.file('src/security/tenantCarbonWorkflowWrites.ts').text();
if (!service.includes('public.activities') || !service.includes('public.measurements') ||
    !service.includes('public.evidence') || !service.includes('public.carbon_calculations')) {
  throw new Error('live workflow write adapters missing');
}
for (const forbidden of ['ownerId', 'organization_name', 'project_intakes', 'ccts_submissions']) {
  if (service.includes(forbidden)) throw new Error(`legacy authorization/schema dependency: ${forbidden}`);
}
if (!service.includes('withTenantTransaction')) throw new Error('tenant transaction context missing');
console.log('PASS tenant carbon workflow write contract');
