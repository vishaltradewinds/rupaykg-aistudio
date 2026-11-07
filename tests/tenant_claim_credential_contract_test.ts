const s = await Bun.file('src/security/tenantClaimCredential.ts').text();
for (const x of ['environmental_attribute_claims','credentials','organization_id','issuer_organization_id','withTenantTransaction','public.verifications']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','carbon_claims','certificates']) if (s.includes(x)) throw new Error('legacy dependency '+x);
if (!s.includes('a.organization_id = ${tenant.organizationId}::uuid')) throw new Error('claim/credential activity tenant guard missing');
console.log('PASS tenant claim/credential live-schema contract');
