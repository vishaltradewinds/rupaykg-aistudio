import crypto from "crypto";

export interface BmIn02002Inputs {
  biogasNm3: number;
  methaneFraction: number;
  methaneRecoveryEfficiency: number;
  hydrogenYieldKgPerNm3Methane: number;
  baselineEmissionsTco2e: number;
  projectEmissionsTco2e: number;
}

export interface BmIn02002Result {
  recoveredMethaneNm3: number;
  hydrogenKg: number;
  emissionReductionsTco2e: number;
  calculationHash: string;
}

function fraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`BM-IN02.002: ${name} must be a fraction between 0 and 1.`);
}
function nonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) throw new Error(`BM-IN02.002: ${name} must be non-negative.`);
}

/** Adapter boundary only: project-specific BEE factors must be supplied from the validated methodology record. */
export class BmIn02002Engine {
  public static calculate(input: BmIn02002Inputs): BmIn02002Result {
    nonNegative("biogasNm3", input.biogasNm3);
    fraction("methaneFraction", input.methaneFraction);
    fraction("methaneRecoveryEfficiency", input.methaneRecoveryEfficiency);
    nonNegative("hydrogenYieldKgPerNm3Methane", input.hydrogenYieldKgPerNm3Methane);
    nonNegative("baselineEmissionsTco2e", input.baselineEmissionsTco2e);
    nonNegative("projectEmissionsTco2e", input.projectEmissionsTco2e);
    const recoveredMethaneNm3 = input.biogasNm3 * input.methaneFraction * input.methaneRecoveryEfficiency;
    const hydrogenKg = recoveredMethaneNm3 * input.hydrogenYieldKgPerNm3Methane;
    const emissionReductionsTco2e = input.baselineEmissionsTco2e - input.projectEmissionsTco2e;
    const canonical = JSON.stringify({ input, recoveredMethaneNm3, hydrogenKg, emissionReductionsTco2e });
    return { recoveredMethaneNm3, hydrogenKg, emissionReductionsTco2e, calculationHash: crypto.createHash("sha256").update(canonical).digest("hex") };
  }
}
