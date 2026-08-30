/**
 * India Environmental Credit Methodology Catalog
 *
 * This catalog distinguishes CURRENTLY APPROVED Government methodologies from
 * pathways that RupayKg may support operationally but MUST NOT treat as
 * credit-issuance eligible until the competent authority approves/notifies them.
 *
 * Source authorities checked 30 Aug 2026:
 * - BEE CCTS Offset Mechanism methodology catalogue
 * - MoEFCC / ICFRE Green Credit Programme notifications
 */
export type MethodologyStatus = 'APPROVED' | 'NOT_YET_APPROVED' | 'REFERENCE_ONLY';
export type CreditOutcome = 'CCC' | 'GREEN_CREDIT' | 'NONE';
export type OperatingContext = 'URBAN' | 'RURAL' | 'BOTH';

export interface IndiaMethodology {
  code: string;
  name: string;
  authority: 'BEE_ICM' | 'GCP_ICFRE' | 'OTHER';
  sector: string;
  context: OperatingContext;
  status: MethodologyStatus;
  creditOutcome: CreditOutcome;
  acvaRequired: boolean;
  notes: string;
}

/**
 * Current BEE Offset Mechanism methodologies listed by BEE as of 07 Jul 2026.
 * These are the only CCTS offset methodologies treated as issuance-eligible
 * by this catalog; the platform must still enforce project applicability.
 */
export const BEE_CCTS_APPROVED: IndiaMethodology[] = [
  { code: 'BM EN01.001', name: 'Grid-connected electricity generation from renewable sources', authority: 'BEE_ICM', sector: 'Energy', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Project must satisfy the methodology applicability conditions and required sectoral scope.' },
  { code: 'BM EN01.002', name: 'Hydrogen production from electrolysis of water', authority: 'BEE_ICM', sector: 'Energy', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Applicable only where project conditions and monitoring requirements are met.' },
  { code: 'BM IN02.001', name: 'Energy efficiency and fuel switching measures for industrial facilities', authority: 'BEE_ICM', sector: 'Industries', context: 'URBAN', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Industrial project pathway; not a generic waste conversion factor.' },
  { code: 'BM IN02.002', name: 'Hydrogen production using methane extracted from biogas', authority: 'BEE_ICM', sector: 'Industries', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Requires methane/biogas production and hydrogen pathway evidence.' },
  { code: 'BM WA03.001', name: 'Landfill methane recovery', authority: 'BEE_ICM', sector: 'Waste Handling and Disposal', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Relevant to qualifying landfill methane recovery projects; not a blanket MSW diversion factor.' },
  { code: 'BM WA03.002', name: 'Flaring or use of landfill gas', authority: 'BEE_ICM', sector: 'Waste Handling and Disposal', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Requires qualifying landfill-gas capture/use or flaring activity.' },
  { code: 'BM AG04.001', name: 'Methane recovery from livestock and manure management at households and small farms', authority: 'BEE_ICM', sector: 'Agriculture', context: 'RURAL', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Relevant to qualifying livestock/manure methane recovery activities.' },
  { code: 'BM FR05.001', name: 'Afforestation and reforestation of degraded mangrove habitats', authority: 'BEE_ICM', sector: 'Forestry', context: 'BOTH', status: 'APPROVED', creditOutcome: 'CCC', acvaRequired: true, notes: 'Mangrove-specific pathway; applicability must be demonstrated.' },
];

/**
 * Current notified Green Credit methodology found in the Government catalogue.
 * Green Credits are independent of CCTS CCCs and follow the GCP administrator's
 * portal/registry and verification process.
 */
export const GCP_APPROVED: IndiaMethodology[] = [
  { code: 'GCP-TREE-PLANTATION-2024', name: 'Methodology for calculation of Green Credit in respect of Tree Plantation', authority: 'GCP_ICFRE', sector: 'Tree Plantation / Eco-restoration', context: 'BOTH', status: 'APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Government-notified GCP methodology; land parcel assignment, plantation completion certification and Administrator evaluation/verification govern issuance.' },
];

/**
 * Operational pathways relevant to RupayKg that may be tracked in MRV, but are
 * NOT represented as approved CCC/Green Credit issuance methodologies until a
 * competent authority notifies/approves them.
 */
export const FUTURE_OR_REFERENCE_PATHWAYS: IndiaMethodology[] = [
  { code: 'GCP-WATER', name: 'Water management / water conservation', authority: 'GCP_ICFRE', sector: 'Water Management', context: 'BOTH', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Track evidence when operationally relevant, but do not issue or market Green Credits through RupayKg unless an applicable notified methodology exists.' },
  { code: 'GCP-SUSTAINABLE-AGRICULTURE', name: 'Sustainable agriculture', authority: 'GCP_ICFRE', sector: 'Agriculture', context: 'RURAL', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Potential GCP activity class; issuance eligibility requires the applicable notified methodology/guideline.' },
  { code: 'GCP-WASTE-MANAGEMENT', name: 'Waste management', authority: 'GCP_ICFRE', sector: 'Waste Management', context: 'BOTH', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Do not equate SWM compliance or waste diversion with Green Credit issuance without an applicable notified methodology.' },
  { code: 'GCP-AIR-POLLUTION', name: 'Air pollution reduction', authority: 'GCP_ICFRE', sector: 'Air Quality', context: 'BOTH', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Evidence may be retained for future eligibility; no credit issuance is permitted without the competent methodology.' },
  { code: 'GCP-MANGROVE', name: 'Mangrove restoration', authority: 'GCP_ICFRE', sector: 'Ecosystem Restoration', context: 'BOTH', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Keep separate from the BEE mangrove carbon methodology; Green Credit eligibility requires its own GCP notification.' },
  { code: 'GCP-SUSTAINABLE-BUILDINGS', name: 'Sustainable building / infrastructure actions', authority: 'GCP_ICFRE', sector: 'Built Environment', context: 'URBAN', status: 'NOT_YET_APPROVED', creditOutcome: 'GREEN_CREDIT', acvaRequired: false, notes: 'Reference pathway only until a current notified methodology applies.' },
];

export const INDIA_ENVIRONMENTAL_METHODOLOGIES = [
  ...BEE_CCTS_APPROVED,
  ...GCP_APPROVED,
  ...FUTURE_OR_REFERENCE_PATHWAYS,
] as const;

export function getMethodology(code: string) {
  return INDIA_ENVIRONMENTAL_METHODOLOGIES.find((m) => m.code === code);
}

export function getIssuanceEligibleMethodologies() {
  return INDIA_ENVIRONMENTAL_METHODOLOGIES.filter((m) => m.status === 'APPROVED' && m.creditOutcome !== 'NONE');
}
