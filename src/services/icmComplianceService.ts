// ========================================================
// INDIAN CARBON MARKET (ICM) COMPLIANCE SERVICE
// ========================================================

export interface ICMComplianceRule {
  sector: string;
  methodologyId: string;
  name: string;
  description: string;
  applicableWasteTypes?: string[];
}

export const ICM_CCTS_SECTORS = [
  "Waste Management",
  "Biomass/Agriculture",
  "Energy Efficiency",
  "Renewable Energy"
] as const;

export type ICM_CCTS_Sector = typeof ICM_CCTS_SECTORS[number];

export const ICM_METHODOLOGIES: Record<ICM_CCTS_Sector, ICMComplianceRule[]> = {
  "Waste Management": [
    {
      sector: "Waste Management",
      methodologyId: "ICM-WM-001",
      name: "Composting & Landfill Diversion",
      description: "Avoidance of methane emissions through aerobic composting of organic waste and diversion from landfills.",
      applicableWasteTypes: ["Municipal Organic Waste", "Food & Kitchen Waste", "Garden & Leaf Litter", "Livestock Manure"]
    },
    {
      sector: "Waste Management",
      methodologyId: "ICM-WM-002",
      name: "Organic Waste Biomethanation",
      description: "Methane recovery and utilization from anaerobic digestion of organic solid waste.",
      applicableWasteTypes: ["Municipal Organic Waste", "Food & Kitchen Waste", "Livestock Manure"]
    },
    {
      sector: "Waste Management",
      methodologyId: "ICM-WM-003",
      name: "Refuse-Derived Fuel (RDF) Production",
      description: "Production and thermal utilization of RDF from non-recyclable dry waste, displacing fossil fuels.",
      applicableWasteTypes: ["Plastic Waste", "Multi-Layered Plastic", "Mixed Municipal Dry Waste", "Textile Waste", "Paper Waste"]
    },
    {
      sector: "Waste Management",
      methodologyId: "ICM-WM-004",
      name: "Waste-to-Energy (WTE) Incineration",
      description: "Controlled combustion of municipal solid waste for clean grid electricity generation.",
      applicableWasteTypes: ["Mixed Municipal Dry Waste"]
    }
  ],
  "Biomass/Agriculture": [
    {
      sector: "Biomass/Agriculture",
      methodologyId: "ICM-AG-001",
      name: "Crop Residue Management",
      description: "Avoided open field burning of agricultural residues through aggregation and supply chain transformation.",
      applicableWasteTypes: ["Crop Residue / Paddy Straw", "Biomass Aggregation", "Coconut Shells / Husk"]
    },
    {
      sector: "Biomass/Agriculture",
      methodologyId: "ICM-AG-002",
      name: "Biochar Production",
      description: "Pyrolysis of agricultural wastes for long-term carbon sequestration in soil.",
      applicableWasteTypes: ["Crop Residue / Paddy Straw", "Biomass Aggregation", "Wood & Forestry Biomass"]
    },
    {
      sector: "Biomass/Agriculture",
      methodologyId: "ICM-AG-003",
      name: "Biomass Thermal Applications",
      description: "Substitution of coal/fossil fuels with agricultural residue pellets/briquettes in industrial boilers.",
      applicableWasteTypes: ["Crop Residue / Paddy Straw", "Biomass Aggregation", "Coconut Shells / Husk"]
    },
    {
      sector: "Biomass/Agriculture",
      methodologyId: "ICM-AG-004",
      name: "Gobar / Community Biogas Systems",
      description: "Small-to-medium scale biomethanation of livestock manure for cooking fuel or decentralized power.",
      applicableWasteTypes: ["Livestock Manure"]
    }
  ],
  "Energy Efficiency": [
    {
      sector: "Energy Efficiency",
      methodologyId: "ICM-EE-001",
      name: "Waste Heat Recovery System (WHRS)",
      description: "Capture of waste heat in industrial processes (composting/biomethanation plants) for mechanical/electrical power.",
    },
    {
      sector: "Energy Efficiency",
      methodologyId: "ICM-EE-002",
      name: "Efficient Water & Waste Pumping",
      description: "Energy efficiency upgrades in municipal wastewater and water supply pumping systems.",
    },
    {
      sector: "Energy Efficiency",
      methodologyId: "ICM-EE-003",
      name: "Smart Municipal Street Lighting",
      description: "Deployment of smart LED lighting and automated control rails in urban wards.",
    }
  ],
  "Renewable Energy": [
    {
      sector: "Renewable Energy",
      methodologyId: "ICM-RE-001",
      name: "Decentralized Solar PV Systems",
      description: "Solar PV installations at Material Recovery Facilities (MRFs) and village resource centers.",
    },
    {
      sector: "Renewable Energy",
      methodologyId: "ICM-RE-002",
      name: "Biomass-based CHP Cogeneration",
      description: "Combined Heat and Power (CHP) plants using waste agricultural residues.",
      applicableWasteTypes: ["Crop Residue / Paddy Straw", "Biomass Aggregation"]
    }
  ]
};

export interface ICMValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    isSectorValid: boolean;
    isMethodologyValid: boolean;
    isAcvaValid: boolean;
    suggestedMethodology?: string;
  };
}

export class ICMComplianceService {
  /**
   * Validates a carbon record against BEE (Bureau of Energy Efficiency) / ICM compliance standards.
   */
  static validate(
    sector: string,
    methodologyId: string,
    acvaId: string,
    wasteType?: string
  ): ICMValidationResult {
    // 1. Validate Sector
    const isSectorValid = ICM_CCTS_SECTORS.includes(sector as ICM_CCTS_Sector);
    if (!isSectorValid) {
      return {
        isValid: false,
        error: `Invalid CCTS Sector: '${sector}'. Supported sectors are: ${ICM_CCTS_SECTORS.join(", ")}.`,
        details: { isSectorValid: false, isMethodologyValid: false, isAcvaValid: true }
      };
    }

    // 2. Validate Methodology under this Sector
    const methodologies = ICM_METHODOLOGIES[sector as ICM_CCTS_Sector] || [];
    const methodologyRule = methodologies.find(m => m.methodologyId === methodologyId);
    
    if (!methodologyRule) {
      const validIds = methodologies.map(m => m.methodologyId).join(", ");
      return {
        isValid: false,
        error: `Invalid Methodology ID '${methodologyId}' for Sector '${sector}'. Valid Methodology IDs for this sector are: ${validIds}.`,
        details: { isSectorValid: true, isMethodologyValid: false, isAcvaValid: true }
      };
    }

    // 3. Optional validation: Warn or fail if waste type is incompatible with methodology
    if (wasteType && methodologyRule.applicableWasteTypes) {
      const isWasteTypeApplicable = methodologyRule.applicableWasteTypes.includes(wasteType);
      if (!isWasteTypeApplicable) {
        // We log a warning or adjust validation, but under strict standards we can warn or require matching.
        // Let's make it a recommendation in details.
        console.warn(`Waste type '${wasteType}' is not typical for Methodology '${methodologyId}'.`);
      }
    }

    // 4. Validate ACVA (Accredited Carbon Verification Agency) ID
    // Standard format matches ACVA-BEE-XXX where XXX is a 3-4 digit registration number, or general ACVA-XXX format
    const acvaRegex = /^ACVA-(BEE-)?[A-Z0-9]{3,8}$/i;
    const isAcvaValid = !!acvaId && acvaRegex.test(acvaId);
    if (!isAcvaValid) {
      return {
        isValid: false,
        error: `Invalid ACVA ID format: '${acvaId}'. Must start with ACVA- or ACVA-BEE- followed by 3-8 alphanumeric characters (e.g. ACVA-BEE-001).`,
        details: { isSectorValid: true, isMethodologyValid: true, isAcvaValid: false }
      };
    }

    return {
      isValid: true,
      details: {
        isSectorValid: true,
        isMethodologyValid: true,
        isAcvaValid: true
      }
    };
  }

  /**
   * Helper to suggest a methodology based on waste type and operating context.
   */
  static suggestMethodology(wasteType: string, context: "urban" | "rural" | string): { sector: string; methodologyId: string } {
    const cleanContext = context?.toLowerCase();
    
    // Organics / Agri Wastes
    if (["Municipal Organic Waste", "Food & Kitchen Waste", "Garden & Leaf Litter", "Livestock Manure"].includes(wasteType)) {
      if (cleanContext === "rural") {
        return { sector: "Biomass/Agriculture", methodologyId: "ICM-AG-004" }; // Gobar / Community Biogas
      }
      return { sector: "Waste Management", methodologyId: "ICM-WM-001" }; // Composting
    }

    if (["Crop Residue / Paddy Straw", "Biomass Aggregation", "Coconut Shells / Husk", "Wood & Forestry Biomass"].includes(wasteType)) {
      return { sector: "Biomass/Agriculture", methodologyId: "ICM-AG-001" }; // Crop Residue Management
    }

    // Dry Recyclables/RDF fuel sources
    if (["Plastic Waste", "Multi-Layered Plastic", "Mixed Municipal Dry Waste", "Textile Waste", "Paper Waste"].includes(wasteType)) {
      return { sector: "Waste Management", methodologyId: "ICM-WM-003" }; // RDF Production
    }

    // Fallback
    return { sector: "Waste Management", methodologyId: "ICM-WM-001" };
  }
}
