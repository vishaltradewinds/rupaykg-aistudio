const s = await Bun.file('src/security/tenantVerification.ts').text();
for (const x of ['public.verifications','verifier_identity_id','authorization_membership_id','authorization_role_id','withTenantTransaction']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','acva_cases','findings']) if (s.includes(x)) throw new Error('legacy dependency '+x);
console.log('PASS tenant verification live-schema contract');
