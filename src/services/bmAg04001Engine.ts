import crypto from "crypto";

export interface BmAg04001Inputs {
  manureQuantityT: number;
  volatileSolidsKgPerT: number;
  methanePotentialM3PerKgVs: number;
  methaneRecoveryEfficiency: number;
  methaneDensityTPerM3: number;
  baselineEmissionsTco2e: number;
  projectEmissionsTco2e: number;
}

export interface BmAg04001Result {
  methanePotentialM3: number;
  recoveredMethaneM3: number;
  recoveredMethaneT: number;
  emissionReductionsTco2e: number;
  calculationHash: string;
}

function fraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`BM-AG04.001: ${name} must be a fraction between 0 and 1.`);
}
function nonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) throw new Error(`BM-AG04.001: ${name} must be non-negative.`);
}

/** Adapter boundary only: methodology-specific BEE factors must come from the validated project record. */
export class BmAg04001Engine {
  public static calculate(input: BmAg04001Inputs): BmAg04001Result {
    nonNegative("manureQuantityT", input.manureQuantityT);
    nonNegative("volatileSolidsKgPerT", input.volatileSolidsKgPerT);
    nonNegative("methanePotentialM3PerKgVs", input.methanePotentialM3PerKgVs);
    fraction("methaneRecoveryEfficiency", input.methaneRecoveryEfficiency);
    nonNegative("methaneDensityTPerM3", input.methaneDensityTPerM3);
    nonNegative("baselineEmissionsTco2e", input.baselineEmissionsTco2e);
    nonNegative("projectEmissionsTco2e", input.projectEmissionsTco2e);

    const volatileSolidsKg = input.manureQuantityT * input.volatileSolidsKgPerT;
    const methanePotentialM3 = volatileSolidsKg * input.methanePotentialM3PerKgVs;
    const recoveredMethaneM3 = methanePotentialM3 * input.methaneRecoveryEfficiency;
    const recoveredMethaneT = recoveredMethaneM3 * input.methaneDensityTPerM3;
    const emissionReductionsTco2e = input.baselineEmissionsTco2e - input.projectEmissionsTco2e;
    const canonical = JSON.stringify({ input, volatileSolidsKg, methanePotentialM3, recoveredMethaneM3, recoveredMethaneT, emissionReductionsTco2e });

    return { methanePotentialM3, recoveredMethaneM3, recoveredMethaneT, emissionReductionsTco2e, calculationHash: crypto.createHash("sha256").update(canonical).digest("hex") };
  }
}
