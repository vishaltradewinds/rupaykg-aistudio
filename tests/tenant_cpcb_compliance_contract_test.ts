const s=await Bun.file('src/security/tenantCpcbCompliance.ts').text();
for(const x of ['evidence_verification_requirements','mrv_observations','mrv_provenance_events','evidence_artifact_series','audit_events'])if(!s.includes(x))throw new Error('missing '+x);
for(const x of ['project_intakes','ccts_submissions','organization_name','ownerId'])if(s.includes(x))throw new Error('legacy dependency '+x);
console.log('PASS G002 MRV assurance lineage contract');
