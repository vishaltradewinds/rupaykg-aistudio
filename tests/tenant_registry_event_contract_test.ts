const s = await Bun.file('src/security/tenantRegistryEvent.ts').text();
for (const x of ['public.registry_events','credential_id','event_hash','recorded_by_identity_id','withTenantTransaction','public.organizations']) if (!s.includes(x)) throw new Error('missing '+x);
for (const x of ['ownerId','organization_name','carbon_claims','certificates']) if (s.includes(x)) throw new Error('legacy dependency '+x);
if (!s.includes('if (fromOwnerId !== tenant.organizationId) return null')) throw new Error('registry bilateral ownership guard missing');
if (!s.includes('public.verifications')) throw new Error('registry verification linkage guard missing');
console.log('PASS tenant registry event live-schema contract');
