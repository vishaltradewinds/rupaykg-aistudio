/**
 * Methodology-specific evidence/tool boundary for RupayKg CCTS workflows.
 *
 * This is an orchestration policy, not an issuance engine. It deliberately
 * does not calculate CCC quantities or declare verification complete.
 * The authoritative BEE methodology/tool register remains the source of
 * truth; this module only prevents an incomplete local MRV package from
 * entering ACVA verification.
 */

export type CctsEvidenceRequirement = {
  id: string;
  label: string;
  description: string;
};

const COMMON: CctsEvidenceRequirement[] = [
  {
    id: "project-boundary",
    label: "Project boundary and ownership",
    description: "Authoritative project identity, location, ownership/control and activity boundary.",
  },
  {
    id: "baseline-additionality",
    label: "Baseline and additionality evidence",
    description: "Evidence required to establish the baseline scenario and applicable additionality test.",
  },
  {
    id: "monitoring-plan",
    label: "Monitoring plan",
    description: "Methodology-aligned parameters, instruments, frequency, QA/QC and responsible parties.",
  },
  {
    id: "source-data",
    label: "Primary monitoring records",
    description: "Traceable source records supporting monitored activity data and calculations.",
  },
  {
    id: "calculation-trail",
    label: "Calculation trail",
    description: "Reproducible methodology/tool calculations with inputs, units, assumptions and versions.",
  },
  {
    id: "double-counting",
    label: "Double-counting controls",
    description: "Evidence that the claimed mitigation is not simultaneously claimed or credited elsewhere.",
  },
];

const BY_METHODOLOGY: Record<string, CctsEvidenceRequirement[]> = {
  "BM EN01.001": [
    { id: "electricity-generation", label: "Electricity generation records", description: "Metered renewable electricity generation and grid/export records." },
  ],
  "BM EN01.002": [
    { id: "hydrogen-production", label: "Hydrogen production records", description: "Measured hydrogen production, electricity consumption and relevant operating records." },
  ],
  "BM EN01.003": [
    { id: "biomass-feedstock", label: "Biomass feedstock records", description: "Traceable biomass quantity, source and sustainability/eligibility records." },
    { id: "heat-electricity-output", label: "Energy output records", description: "Metered electricity and/or useful heat generation records." },
  ],
  "BM IN02.001": [
    { id: "industrial-energy", label: "Industrial energy records", description: "Metered fuel/energy consumption, production and equipment operating records." },
  ],
  "BM IN02.002": [
    { id: "biogas-methane", label: "Biogas/methane records", description: "Measured methane extraction, composition, flow and utilization records." },
  ],
  "BM WA03.001": [
    { id: "landfill-gas", label: "Landfill gas monitoring", description: "Landfill gas flow, composition, recovery and utilization/handling records." },
  ],
  "BM WA03.002": [
    { id: "flare-monitoring", label: "Flare monitoring", description: "Gas flow/composition, flare operating status and destruction-efficiency evidence." },
  ],
  "BM WA03.003": [
    { id: "feedstock-cbg", label: "CBG feedstock and production records", description: "Eligible feedstock, anaerobic digestion, gas purification and CBG output records." },
  ],
  "BM AG04.001": [
    { id: "livestock-manure", label: "Livestock/manure records", description: "Livestock population, manure management, methane recovery and operating records." },
  ],
  "BM AG04.002": [
    { id: "rice-practice", label: "Rice cultivation practice records", description: "Area, cultivation regime and monitored practice changes supporting emission-reduction claims." },
  ],
  "BM FR05.001": [
    { id: "mangrove-carbon", label: "Mangrove carbon-stock evidence", description: "Project-area, biomass/carbon-stock and permanence monitoring records." },
  ],
  "BM FR05.002": [
    { id: "afforestation-carbon", label: "Afforestation carbon-stock evidence", description: "Project-area, land eligibility, biomass/carbon-stock and permanence monitoring records." },
  ],
};

export function getCctsEvidenceRequirements(methodologyCode: string): CctsEvidenceRequirement[] {
  const methodologyRequirements = BY_METHODOLOGY[methodologyCode];
  if (!methodologyRequirements) {
    throw new Error(`CCTS_METHODOLOGY_NOT_REGISTERED_FOR_MRV:${methodologyCode}`);
  }
  return [...COMMON, ...methodologyRequirements];
}

export function assertCctsMrvEvidenceComplete(input: {
  methodologyCode: string;
  evidenceIds: readonly string[];
}): void {
  const required = getCctsEvidenceRequirements(input.methodologyCode);
  const supplied = new Set(input.evidenceIds);
  const missing = required.filter((item) => !supplied.has(item.id)).map((item) => item.id);

  if (missing.length > 0) {
    throw new Error(`CCTS_MRV_EVIDENCE_INCOMPLETE:${input.methodologyCode}:${missing.join(",")}`);
  }
}
