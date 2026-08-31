import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceRoot = path.join(repoRoot, 'src');

const forbiddenImportPatterns = [
  /from\s+['"][^'"]*enterpriseMrvService[^'"]*['"]/, 
  /from\s+['"][^'"]*services\/legacy\/[^'"]*['"]/, 
  /from\s+['"][^'"]*services\/registryGatewayAdapter[^'"]*['"]/, 
  /from\s+['"][^'"]*services\/cccRegistryService[^'"]*['"]/, 
  /from\s+['"][^'"]*services\/creditDepositoryService[^'"]*['"]/, 
];

const quarantinedLegacyFiles = [
  'src/services/legacy/cccRegistryService.ts',
  'src/services/legacy/creditDepositoryService.ts',
  'src/services/legacy/registryGatewayAdapter.ts',
];

function walk(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === 'legacy') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

const violations: string[] = [];
for (const file of walk(sourceRoot)) {
  const relative = path.relative(repoRoot, file).replaceAll(path.sep, '/');
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of forbiddenImportPatterns) {
    if (pattern.test(content)) violations.push(`${relative}: forbidden legacy import`);
  }
}

for (const relative of quarantinedLegacyFiles) {
  const file = path.join(repoRoot, relative);
  if (!fs.existsSync(file)) {
    violations.push(`${relative}: quarantine marker file missing`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  if (!/QUARANTINED|LEGACY \/ SANDBOX REGISTRY GATEWAY/i.test(content)) {
    violations.push(`${relative}: missing explicit quarantine marker`);
  }
}

const enterpriseSuite = path.join(sourceRoot, 'components', 'EnterpriseSuite.tsx');
if (fs.existsSync(enterpriseSuite)) {
  const content = fs.readFileSync(enterpriseSuite, 'utf8');
  if (!content.includes("from './CCTSCarbonOS'")) {
    violations.push('src/components/EnterpriseSuite.tsx: canonical CCTSCarbonOS route missing');
  }
  if (/enterpriseMrvService|enterpriseStore/.test(content)) {
    violations.push('src/components/EnterpriseSuite.tsx: legacy MRV store reference remains');
  }
}

if (violations.length) {
  console.error('CONSOLIDATION CALL-GRAPH CHECK FAILED');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('CONSOLIDATION CALL-GRAPH CHECK PASSED');
console.log('- No production imports of quarantined/retired services detected.');
console.log('- EnterpriseSuite routes to canonical CCTSCarbonOS.');
console.log('- Quarantine markers are present on retained legacy files.');
