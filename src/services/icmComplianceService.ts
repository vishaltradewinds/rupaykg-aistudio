// ========================================================
// INDIAN CARBON MARKET (ICM) / CCTS COMPLIANCE SERVICE
// Source of truth: BEE approved methodologies under the
// CCTS Offset Mechanism (current published catalogue).
//
// IMPORTANT: RupayKg does not issue CCCs. BEE/ICM is the
// authoritative issuance layer; ACVAs independently validate/
// verify where required by the applicable CCTS process.
// ========================================================

export interface ICMComplianceRule {
  sector: string;
  methodologyId: string;
  name: string;
  description: string;
  applicableWasteTypes?: string[];
  operatingContexts?: Array<"urban" | "rural" | "both">;
}

export const ICM_CCTS_SECTORS = [
  "Energy",
  "Industries",
  "Waste Handling and Disposal",
  "Agriculture",
  "Forestry"
] as const;

export type ICM_CCTS_Sector = typeof ICM_CCTS_SECTORS[number];

// Current BEE-approved catalogue as published 07 Jul 2026.
// This catalogue is eligibility metadata only; it never constitutes an
// issuance decision. Project-specific eligibility remains subject to the
// CCTS procedure, validation/verification and BEE/ICM determination.
export const ICM_METHODOLOGIES: Record<ICM_CCTS_Sector, ICMComplianceRule[]> = {
  Energy: [
    { sector: "Energy", methodologyId: "BM EN01.001", name: "Grid-connected electricity generation from renewable sources", description: "BEE-approved CCTS Offset Mechanism methodology for grid-connected renewable electricity generation.", operatingContexts: ["both"] },
    { sector: "Energy", methodologyId: "BM EN01.002", name: "Hydrogen production from electrolysis of water", description: "BEE-approved CCTS Offset Mechanism methodology for hydrogen production from water electrolysis.", operatingContexts: ["both"] },
    { sector: "Energy", methodologyId: "BM EN01.003", name: "Electricity and Heat Generation from Biomass", description: "BEE-approved CCTS Offset Mechanism methodology for eligible electricity and heat generation from biomass.", applicableWasteTypes: ["Biomass", "Agricultural Residue", "Organic Waste"], operatingContexts: ["both"] }
  ],
  Industries: [
    { sector: "Industries", methodologyId: "BM IN02.001", name: "Energy efficiency and fuel switching measures for industrial facilities", description: "BEE-approved CCTS Offset Mechanism methodology covering eligible industrial energy-efficiency and fuel-switching measures.", operatingContexts: ["both"] },
    { sector: "Industries", methodologyId: "BM IN02.002", name: "Hydrogen production using methane extracted from biogas", description: "BEE-approved CCTS Offset Mechanism methodology for eligible hydrogen production using methane extracted from biogas.", applicableWasteTypes: ["Biogas", "Livestock Manure", "Organic Waste"], operatingContexts: ["both"] }
  ],
  "Waste Handling and Disposal": [
    { sector: "Waste Handling and Disposal", methodologyId: "BM WA03.001", name: "Landfill methane recovery", description: "BEE-approved methodology for eligible methane recovery from solid waste disposal sites.", applicableWasteTypes: ["Municipal Solid Waste", "Biodegradable Waste", "Industrial Solid Waste", "Landfill Gas"], operatingContexts: ["both"] },
    { sector: "Waste Handling and Disposal", methodologyId: "BM WA03.002", name: "Flaring or use of landfill gas", description: "BEE-approved methodology for eligible capture, flaring and/or use of landfill gas for energy or other qualifying service displacement.", applicableWasteTypes: ["Municipal Solid Waste", "Biodegradable Waste", "Industrial Solid Waste", "Landfill Gas"], operatingContexts: ["both"] },
    { sector: "Waste Handling and Disposal", methodologyId: "BM WA03.003", name: "Production of Compressed Bio-gas (CBG)", description: "BEE-approved CCTS Offset Mechanism methodology for eligible production of compressed bio-gas from qualifying feedstocks.", applicableWasteTypes: ["Organic Waste", "Biomass", "Agricultural Residue", "Livestock Manure"], operatingContexts: ["both"] }
  ],
  Agriculture: [
    { sector: "Agriculture", methodologyId: "BM AG04.001", name: "Methane recovery from livestock and manure management at households and small farms", description: "BEE-approved CCTS Offset Mechanism methodology for eligible methane recovery from livestock and manure management at households and small farms.", applicableWasteTypes: ["Livestock Manure", "Animal Waste", "Biogas"], operatingContexts: ["rural", "both"] },
    { sector: "Agriculture", methodologyId: "BM AG04.002", name: "Emission reduction through improved management practices in rice cultivation", description: "BEE-approved CCTS Offset Mechanism methodology for eligible emission reductions through improved rice cultivation management practices.", applicableWasteTypes: ["Rice Cultivation", "Agricultural Residue"], operatingContexts: ["rural", "both"] }
  ],
  Forestry: [
    { sector: "Forestry", methodologyId: "BM FR05.001", name: "Afforestation and reforestation of degraded mangrove habitats", description: "BEE-approved CCTS Offset Mechanism methodology for eligible afforestation/reforestation of degraded mangrove habitats.", operatingContexts: ["both"] },
    { sector: "Forestry", methodologyId: "BM FR05.002", name: "Afforestation and reforestation of lands except wetlands", description: "BEE-approved CCTS Offset Mechanism methodology for eligible afforestation/reforestation of land outside the wetland category.", operatingContexts: ["both"] }
  ]
};

export interface ICMValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    isSectorValid: boolean;
    isMethodologyValid: boolean;
    isAcvaValid: boolean;
    isContextValid?: boolean;
    suggestedMethodology?: string;
  };
}

/** BEE-published ACVA register entries relevant to RupayKg's CCTS routing. */
export const CCTS_ACVAS = [
  { id: "ACVA001", name: "VKU Certification Private Limited", sectors: ["Energy", "Industries", "Waste Handling and Disposal", "Agriculture", "Forestry"] },
  { id: "ACVA002", name: "Bureau Veritas India (Pvt.) Ltd", sectors: ["Energy", "Industries", "Waste Handling and Disposal", "Agriculture", "Forestry", "Transport", "Fugitive Emission"] },
  { id: "ACVA003", name: "TUV India Private Limited", sectors: ["Industries", "Agriculture", "Transport"] },
  { id: "ACVA004", name: "Earthood Services Limited", sectors: ["Energy", "Industries", "Waste Handling and Disposal", "Agriculture", "Forestry"] },
  { id: "ACVA006", name: "KBS Certification Services Limited", sectors: ["Energy", "Industries", "Waste Handling and Disposal", "Agriculture", "Forestry", "Transport", "Fugitive Emission"] }
] as const;

export class ICMComplianceService {
  static getMethodology(sector: string, methodologyId: string): ICMComplianceRule | undefined {
    if (!ICM_CCTS_SECTORS.includes(sector as ICM_CCTS_Sector)) return undefined;
    return ICM_METHODOLOGIES[sector as ICM_CCTS_Sector].find(m => m.methodologyId === methodologyId);
  }

  static listMethodologies(context?: "urban" | "rural"): ICMComplianceRule[] {
    return ICM_CCTS_SECTORS.flatMap(sector => ICM_METHODOLOGIES[sector]).filter(rule => {
      if (!context) return true;
      return rule.operatingContexts?.includes("both") || rule.operatingContexts?.includes(context);
    });
  }

  static isAcvaAccreditedForSector(acvaId: string, sector: string): boolean {
    const acva = CCTS_ACVAS.find(a => a.id.toUpperCase() === acvaId?.toUpperCase());
    return !!acva && acva.sectors.some(s => s === sector);
  }

  static validate(sector: string, methodologyId: string, acvaId: string, wasteType?: string, context?: "urban" | "rural"): ICMValidationResult {
    const isSectorValid = ICM_CCTS_SECTORS.includes(sector as ICM_CCTS_Sector);
    if (!isSectorValid) return { isValid: false, error: `Invalid CCTS sector '${sector}'.`, details: { isSectorValid: false, isMethodologyValid: false, isAcvaValid: false } };

    const methodologyRule = this.getMethodology(sector, methodologyId);
    if (!methodologyRule) return { isValid: false, error: `Methodology '${methodologyId}' is not in the current BEE-approved CCTS catalogue for '${sector}'.`, details: { isSectorValid: true, isMethodologyValid: false, isAcvaValid: false } };

    const isContextValid = !context || methodologyRule.operatingContexts?.includes("both") || methodologyRule.operatingContexts?.includes(context);
    if (!isContextValid) return { isValid: false, error: `Methodology '${methodologyId}' is not routed for the '${context}' operating context by RupayKg.`, details: { isSectorValid: true, isMethodologyValid: true, isAcvaValid: false, isContextValid: false } };

    if (wasteType && methodologyRule.applicableWasteTypes && !methodologyRule.applicableWasteTypes.includes(wasteType)) return { isValid: false, error: `Activity/waste type '${wasteType}' is not listed for methodology '${methodologyId}'. ACVA/BEE eligibility must not be inferred.`, details: { isSectorValid: true, isMethodologyValid: true, isAcvaValid: false, isContextValid: true } };

    const isAcvaValid = this.isAcvaAccreditedForSector(acvaId, sector);
    if (!isAcvaValid) return { isValid: false, error: `ACVA '${acvaId}' is not present in RupayKg's current BEE-published sector accreditation registry for '${sector}'.`, details: { isSectorValid: true, isMethodologyValid: true, isAcvaValid: false, isContextValid: true } };

    return { isValid: true, details: { isSectorValid: true, isMethodologyValid: true, isAcvaValid: true, isContextValid: true } };
  }

  static suggestMethodology(activityType: string, context: "urban" | "rural" | string): { sector: string; methodologyId: string; status: "methodology_match" | "mrV_only" } {
    const cleanContext = context?.toLowerCase();
    const activity = activityType?.toLowerCase() || "";

    if ((cleanContext === "urban" || cleanContext === "rural") && /(landfill|landfill gas|methane recovery|methane capture)/.test(activity)) {
      return { sector: "Waste Handling and Disposal", methodologyId: "BM WA03.002", status: "methodology_match" };
    }
    if (cleanContext === "urban" || cleanContext === "rural") {
      if (/(compressed bio.?gas|cbg|biomethane)/.test(activity)) return { sector: "Waste Handling and Disposal", methodologyId: "BM WA03.003", status: "methodology_match" };
      if (/(biomass.*electricity|electricity.*biomass|biomass.*heat)/.test(activity)) return { sector: "Energy", methodologyId: "BM EN01.003", status: "methodology_match" };
    }
    if (cleanContext === "rural" && /(livestock manure|animal waste|manure|biogas)/.test(activity)) return { sector: "Agriculture", methodologyId: "BM AG04.001", status: "methodology_match" };
    if (cleanContext === "rural" && /(rice cultivation|rice farming|paddy)/.test(activity)) return { sector: "Agriculture", methodologyId: "BM AG04.002", status: "methodology_match" };
    if (/(mangrove|afforestation|reforestation)/.test(activity)) return { sector: "Forestry", methodologyId: "BM FR05.002", status: "methodology_match" };

    return { sector: "", methodologyId: "", status: "mrV_only" };
  }
}
