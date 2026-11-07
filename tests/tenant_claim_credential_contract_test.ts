const s = await Bun.file('src/security/tenantClaimCredential.ts').text();
for (const x of ['environmental_attribute_claims','credentials','organization_id','issuer_organization_id','withTenantTransaction']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','carbon_claims','certificates']) if (s.includes(x)) throw new Error('legacy dependency '+x);
console.log('PASS tenant claim/credential live-schema contract');
