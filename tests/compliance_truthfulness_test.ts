import fs from 'fs';

const service = fs.readFileSync('src/services/complianceService.ts', 'utf8');

if (!service.includes("const requestedStatus = data.status || 'PENDING';")) {
  throw new Error('COMPLIANCE REGRESSION: compliance records must default to PENDING');
}

if (!service.includes("requestedStatus === 'COMPLIANT' && (!verifiedBy || evidenceUrls.length === 0)")) {
  throw new Error('COMPLIANCE REGRESSION: COMPLIANT status must require verifier and evidence');
}

console.log('COMPLIANCE_TRUTHFULNESS_CONTRACT: PASS');
