// Canonical India CCTS Offset Mechanism catalogue. Keep issuance eligibility
// aligned with BEE's current published methodology list; future/draft sectors
// must never become issuance-eligible until officially approved.
export type CreditPathway = 'CCC' | 'GREEN_CREDIT';
export type ApprovalStatus = 'APPROVED' | 'DRAFT' | 'FUTURE';

export interface IndiaMethodology {
  id: string;
  sector: string;
  name: string;
  pathway: CreditPathway;
  issuer: 'BEE_ICM' | 'GCP_ICFRE';
  status: ApprovalStatus;
  urban: boolean;
  rural: boolean;
  acvaRequired: boolean;
}

export const INDIA_METHODOLOGIES: IndiaMethodology[] = [
  {id:'BM EN01.001',sector:'Energy',name:'Grid-connected electricity generation from renewable sources',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM EN01.002',sector:'Energy',name:'Hydrogen production from electrolysis of water',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM EN01.003',sector:'Energy',name:'Electricity and heat generation from biomass',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM IN02.001',sector:'Industries',name:'Energy efficiency and fuel switching measures for industrial facilities',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:false,acvaRequired:true},
  {id:'BM IN02.002',sector:'Industries',name:'Hydrogen production using methane extracted from biogas',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM WA03.001',sector:'Waste Handling and Disposal',name:'Landfill methane recovery',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM WA03.002',sector:'Waste Handling and Disposal',name:'Flaring or use of landfill gas',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM WA03.003',sector:'Waste Handling and Disposal',name:'Production of Compressed Bio-gas (CBG)',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM AG04.001',sector:'Agriculture',name:'Methane recovery from livestock and manure management at households and small farms',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:false,rural:true,acvaRequired:true},
  {id:'BM AG04.002',sector:'Agriculture',name:'Emission reduction through improved management practices in rice cultivation',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:false,rural:true,acvaRequired:true},
  {id:'BM FR05.001',sector:'Forestry',name:'Afforestation and reforestation of degraded mangrove habitats',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'BM FR05.002',sector:'Forestry',name:'Afforestation and reforestation of lands except wetlands',pathway:'CCC',issuer:'BEE_ICM',status:'APPROVED',urban:true,rural:true,acvaRequired:true},
  {id:'GCP-TREE-PLANTATION',sector:'Green Credit',name:'Tree plantation / eco-restoration',pathway:'GREEN_CREDIT',issuer:'GCP_ICFRE',status:'APPROVED',urban:true,rural:true,acvaRequired:false},
  {id:'GCP-WATER',sector:'Green Credit',name:'Water management',pathway:'GREEN_CREDIT',issuer:'GCP_ICFRE',status:'FUTURE',urban:true,rural:true,acvaRequired:false},
  {id:'GCP-SUSTAINABLE-AGRICULTURE',sector:'Green Credit',name:'Sustainable agriculture',pathway:'GREEN_CREDIT',issuer:'GCP_ICFRE',status:'FUTURE',urban:false,rural:true,acvaRequired:false},
  {id:'GCP-WASTE',sector:'Green Credit',name:'Waste management',pathway:'GREEN_CREDIT',issuer:'GCP_ICFRE',status:'FUTURE',urban:true,rural:true,acvaRequired:false},
];

export function getEligibleIndiaMethodologies(context: 'URBAN'|'RURAL') {
  return INDIA_METHODOLOGIES.filter(m => m.status === 'APPROVED' && (context === 'URBAN' ? m.urban : m.rural));
}

export function assertIssuanceEligibility(methodologyId: string) {
  const m = INDIA_METHODOLOGIES.find(x => x.id === methodologyId);
  if (!m) throw new Error('METHODOLOGY_NOT_FOUND');
  if (m.status !== 'APPROVED') throw new Error('METHODOLOGY_NOT_CURRENTLY_APPROVED');
  return m;
}
