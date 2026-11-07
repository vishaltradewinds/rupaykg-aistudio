const required=['tenantContext','tenantCarbonProject','tenantCarbonWorkflow','tenantVerification','tenantClaimCredential','tenantRegistryEvent','tenantCpcbCompliance'];
for(const p of required){if(!(await Bun.file('src/security/'+p+'.ts').exists()))throw new Error('missing '+p)}
console.log('PASS G002 two-organization isolation implementation inventory');
