const s = await Bun.file('src/security/tenantRegistryEvent.ts').text();
for (const x of ['public.registry_events','credential_id','event_hash','recorded_by_identity_id','withTenantTransaction']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','carbon_claims','certificates']) if (s.includes(x)) throw new Error('legacy dependency '+x);
console.log('PASS tenant registry event live-schema contract');
