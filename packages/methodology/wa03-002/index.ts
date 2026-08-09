import { BMT011 } from '../tools/bm-t-011/index.ts';

export const WA03_002 = {
  methodology_code: "BM WA03.002",
  version: "1.0",
  applicability: "Avoidance of methane emissions through composting",
  tools_required: ["BM-T-011"],
  calculateEmissionReductions: (inputs: any) => {
    // ERy = BEy - PEy - LEy
    const { W_j_x, DOC_j, k_j, year, startYear, PE_y, LE_y } = inputs;
    const BEy = BMT011.calculateMethaneAvoided(W_j_x, DOC_j, k_j, year, startYear);
    return BEy - PE_y - LE_y;
  }
};
