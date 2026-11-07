const gate = await Bun.file('src/security/legacyWorkflowGate.ts').text();
if (!gate.includes('LEGACY_WORKFLOW_NOT_AUTHORITATIVE')) throw new Error('legacy workflow fail-closed gate missing');
if (!gate.includes('TENANT_CONTEXT_UNRESOLVED')) throw new Error('tenant fail-closed behavior missing');
const routes = await Bun.file('src/routes/carbon.ts').text();
for (const path of ['/projects/:id/intake','/projects/:id/ccts-submit','/projects/:id/monitoring-report','/projects/:id/audit-package','/pilot/issues','/pilot/issues/:issueId/resolve']) {
  if (!routes.includes(path)) throw new Error(`expected legacy route missing: ${path}`);
}
if (!routes.includes('rejectLegacyWorkflow')) throw new Error('carbon routes not wired to legacy workflow gate');
console.log('PASS legacy workflow fail-closed contract');

const routes = await Bun.file('src/routes/carbon.ts').text();
for (const path of ['/kathonda', '/rural', '/legal-entities', '/icm', '/programmes', '/generic-cpas', '/cpas', '/monitoring-periods', '/carbon-rights', '/mrv-packages', '/acva-engagements', '/urban']) {
  if (!routes.includes(path)) throw new Error('missing legacy global boundary: ' + path);
}
if (!routes.includes('LEGACY_WORKFLOW_NOT_AUTHORITATIVE')) throw new Error('legacy global boundary missing');
console.log('PASS legacy global carbon namespaces fail closed');
