const s=await Bun.file('src/security/tenantCpcbCompliance.ts').text();
for(const x of ['cpcb_swm_stakeholder_workspaces','cpcb_swm_status_history','organization_epr_applicability','organization_bwg_assessments','withTenantTransaction'])if(!s.includes(x))throw new Error('missing '+x);
for(const x of ['organization_name','ownerId','ccts_submissions','project_intakes'])if(s.includes(x))throw new Error('legacy dependency '+x);
console.log('PASS tenant CPCB/SWM compliance contract');
