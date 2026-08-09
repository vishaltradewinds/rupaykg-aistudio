export const BMT011 = {
  version: "1.0",
  name: "Emissions from solid waste disposal sites",
  applicability: ["BM WA03.001", "BM WA03.002"],
  parameters: {
    GWP_CH4: { value: 29.8, unit: "tCO2e/tCH4", source: "IPCC AR6" },
    OX: { value: 0.1, unit: "fraction", description: "Oxidation factor" },
    DOCf: { value: 0.5, unit: "fraction", description: "Fraction of DOC that can decompose" },
    MCF: { value: 1.0, unit: "fraction", description: "Methane correction factor for anaerobic managed SWDS" },
    F: { value: 0.5, unit: "fraction", description: "Fraction of methane in SWDS gas" },
    DOC_j: { 
      organic: { value: 0.15, unit: "fraction" }, // wood, paper, etc. have different DOC, keeping simple for now
    },
    k_j: {
      organic: { value: 0.05, unit: "1/yr" }
    }
  },
  calculateMethaneAvoided: (W_j_x: number, DOC_j: number, k_j: number, year: number, startYear: number) => {
    // Basic first order decay model
    // This is a simplified version of the FOD model for demonstration
    const t = year - startYear;
    const GWP_CH4 = 29.8;
    const OX = 0.1;
    const F = 0.5;
    const DOCf = 0.5;
    const MCF = 1.0;
    
    // BE_CH4,SWDS,y = phi * (1 - f) * GWP_CH4 * (1 - OX) * 16/12 * F * DOCf * MCF * sum(W_j_x * DOC_j * exp(-k_j * (y-x)) * (1 - exp(-k_j)))
    // Assuming phi=1, f=0 for simplicity
    
    const methane_gen = W_j_x * DOC_j * Math.exp(-k_j * t) * (1 - Math.exp(-k_j));
    const BE_CH4_SWDS_y = 1 * (1 - 0) * GWP_CH4 * (1 - OX) * (16/12) * F * DOCf * MCF * methane_gen;
    return BE_CH4_SWDS_y;
  }
};
