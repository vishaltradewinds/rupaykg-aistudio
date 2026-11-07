const s = await Bun.file('src/security/tenantVerification.ts').text();
for (const x of ['public.verifications','verifier_identity_id','authorization_membership_id','authorization_role_id','withTenantTransaction','public.carbon_projects']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','acva_cases','findings']) if (s.includes(x)) throw new Error('legacy dependency '+x);
if (!s.includes('cp.organization_id = ${tenant.organizationId}::uuid')) throw new Error('verification project tenant guard missing');
console.log('PASS tenant verification live-schema contract');
