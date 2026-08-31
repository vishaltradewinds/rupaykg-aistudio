export type MethodologyStatus = "planned" | "mapped" | "implemented" | "software_verified" | "external_validation_pending" | "method_reconciled";

export interface MethodologyDefinition {
  id: string;
  title: string;
  family: "energy" | "industry" | "waste" | "agriculture" | "forestry";
  status: MethodologyStatus;
  contexts: readonly ["urban", "rural", "mixed"];
}

/** Canonical registry: one equation engine, context-specific evidence lineage. */
export const METHODOLOGIES: readonly MethodologyDefinition[] = [
  { id: "BM-EN01.001", title: "Renewable grid electricity", family: "energy", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-EN01.002", title: "Electrolytic hydrogen", family: "energy", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-EN01.003", title: "Electricity and heat generation from biomass", family: "energy", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-IN02.001", title: "Industrial efficiency and fuel switching", family: "industry", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-IN02.002", title: "Hydrogen from methane extracted from biogas", family: "industry", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-WA03.001", title: "Landfill methane recovery", family: "waste", status: "external_validation_pending", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-WA03.002", title: "Flaring or use of landfill gas", family: "waste", status: "implemented", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-WA03.003", title: "Production of compressed bio-gas", family: "waste", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-AG04.001", title: "Methane recovery from livestock and manure management", family: "agriculture", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-AG04.002", title: "Improved management practices in rice cultivation", family: "agriculture", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-FR05.001", title: "Mangrove afforestation/reforestation", family: "forestry", status: "planned", contexts: ["urban", "rural", "mixed"] },
  { id: "BM-FR05.002", title: "Afforestation/reforestation except wetlands", family: "forestry", status: "planned", contexts: ["urban", "rural", "mixed"] }
];
