import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const onboardingPath = path.join(repoRoot, 'src/components/StakeholderOnboardingHub.tsx');
const serverPath = path.join(repoRoot, 'server.ts');

const onboarding = fs.readFileSync(onboardingPath, 'utf8');
const server = fs.readFileSync(serverPath, 'utf8');

assert.equal(
  onboarding.includes("|| 'password123'") || onboarding.includes('|| "password123"'),
  false,
  'Stakeholder onboarding must never silently substitute a known/default password.'
);

assert.equal(
  /ADMIN_PASSWORD\s*\|\|\s*[\'\"]admin123/.test(server),
  false,
  'Server must never fall back to a known default administrator password.'
);

console.log('registration security contract: PASS');
