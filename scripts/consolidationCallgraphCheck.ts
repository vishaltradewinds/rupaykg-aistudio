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

const retiredFiles = [
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

for (const relative of retiredFiles) {
  if (fs.existsSync(path.join(repoRoot, relative))) {
    violations.push(`${relative}: retired legacy file still present`);
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
console.log('- No production imports of retired services detected.');
console.log('- Retired legacy registry/MRV files are absent.');
console.log('- EnterpriseSuite routes to canonical CCTSCarbonOS.');
