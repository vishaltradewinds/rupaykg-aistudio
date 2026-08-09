import { BMT011 } from '../tools/bm-t-011/index.ts';

export const WA03_001 = {
  methodology_code: "BM WA03.001",
  version: "1.0",
  applicability: "Landfill gas recovery and destruction",
  tools_required: ["BM-T-011"],
  calculateEmissionReductions: (inputs: any) => {
    const { F_CH4_PJ_y, F_CH4_BL_y, PE_y, LE_y } = inputs;
    const ERy = ((F_CH4_PJ_y - F_CH4_BL_y) * BMT011.parameters.GWP_CH4.value * (1 - BMT011.parameters.OX.value)) - PE_y - LE_y;
    return ERy;
  }
};
