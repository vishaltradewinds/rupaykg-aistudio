import { BMT011 } from '../tools/bm-t-011/index.ts';

export const WA03_001 = {
  methodology_code: "BM WA03.001",
  version: "1.0",
  applicability: "Landfill gas recovery and destruction",
  tools_required: ["BM-T-011"],
  calculateEmissionReductions: (inputs: any) => {
    const { F_CH4_PJ_y, F_CH4_BL_y, PE_y, LE_y } = inputs;
    const ERy = ((F_CH4_PJ_y - F_CH4_BL_y) * 28 * (1 - 0.10)) - PE_y - LE_y;
    return ERy;
  },
  getDetailedTrace: (inputs: any) => {
    const { F_CH4_PJ_y, F_CH4_BL_y, PE_y, LE_y } = inputs;
    const delta_F_CH4 = F_CH4_PJ_y - F_CH4_BL_y;
    const GWP_CH4 = 28; // tCO2e/tCH4 (IPCC AR5 / BEE standard)
    const O_f = 0.10; // Oxidation factor
    const BE_raw = delta_F_CH4 * GWP_CH4;
    const BE_y = BE_raw * (1 - O_f);
    const ERy = BE_y - PE_y - LE_y;

    return {
      methodology: "BM WA03.001",
      version: "1.0",
      inputs: {
        F_CH4_PJ_y: { value: F_CH4_PJ_y, unit: "tCH4/yr", description: "Methane captured by project LFG recovery system" },
        F_CH4_BL_y: { value: F_CH4_BL_y, unit: "tCH4/yr", description: "Baseline methane capture obligation" },
        PE_y: { value: PE_y, unit: "tCO2e/yr", description: "Project auxiliary emissions" },
        LE_y: { value: LE_y, unit: "tCO2e/yr", description: "Leakage emissions" }
      },
      parameters: {
        GWP_CH4: { value: GWP_CH4, unit: "tCO2e/tCH4", source: "IPCC AR5 / BEE CCTS Standard" },
        O_f: { value: O_f, unit: "fraction", description: "Topsoil Methane Oxidation Factor" }
      },
      intermediate_steps: [
        {
          step: 1,
          name: "Net Methane Destroyed Above Baseline (delta_F_CH4)",
          formula: "F_CH4_PJ_y - F_CH4_BL_y",
          calculation: `${F_CH4_PJ_y} - ${F_CH4_BL_y}`,
          value: delta_F_CH4,
          unit: "tCH4/yr"
        },
        {
          step: 2,
          name: "Baseline Methane CO2e Before Oxidation (BE_raw)",
          formula: "delta_F_CH4 * GWP_CH4",
          calculation: `${delta_F_CH4} * ${GWP_CH4}`,
          value: BE_raw,
          unit: "tCO2e/yr"
        },
        {
          step: 3,
          name: "Baseline Emissions After Soil Oxidation (BE_y)",
          formula: "BE_raw * (1 - O_f)",
          calculation: `${BE_raw} * (1 - ${O_f})`,
          value: BE_y,
          unit: "tCO2e/yr"
        },
        {
          step: 4,
          name: "Final Emission Reductions (ER_y)",
          formula: "BE_y - PE_y - LE_y",
          calculation: `${BE_y} - ${PE_y} - ${LE_y}`,
          value: ERy,
          unit: "tCO2e/yr"
        }
      ],
      result: {
        ERy,
        unit: "tCO2e/yr"
      }
    };
  }
};
