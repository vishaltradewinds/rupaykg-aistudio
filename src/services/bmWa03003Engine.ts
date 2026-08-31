import crypto from "crypto";

export interface BmWa03003Inputs {
  biogasNm3: number;
  methaneFraction: number;
  methaneRecoveryEfficiency: number;
  methaneEnergyMjPerNm3: number;
  projectEnergyEfficiency: number;
  projectEmissionsTco2e?: number;
  baselineEmissionsTco2e?: number;
}

export interface BmWa03003Result {
  recoveredMethaneNm3: number;
  methaneEnergyMj: number;
  usefulEnergyMj: number;
  emissionReductionsTco2e: number;
  calculationHash: string;
}

function fraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`BM-WA03.003: ${name} must be a fraction between 0 and 1.`);
}
function nonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) throw new Error(`BM-WA03.003: ${name} must be non-negative.`);
}

/** Canonical adapter boundary for CBG production. Method-specific BEE factors must be supplied by the validated project record. */
export class BmWa03003Engine {
  public static calculate(input: BmWa03003Inputs): BmWa03003Result {
    nonNegative("biogasNm3", input.biogasNm3);
    fraction("methaneFraction", input.methaneFraction);
    fraction("methaneRecoveryEfficiency", input.methaneRecoveryEfficiency);
    fraction("projectEnergyEfficiency", input.projectEnergyEfficiency);
    nonNegative("methaneEnergyMjPerNm3", input.methaneEnergyMjPerNm3);
    nonNegative("projectEmissionsTco2e", input.projectEmissionsTco2e ?? 0);
    nonNegative("baselineEmissionsTco2e", input.baselineEmissionsTco2e ?? 0);

    const recoveredMethaneNm3 = input.biogasNm3 * input.methaneFraction * input.methaneRecoveryEfficiency;
    const methaneEnergyMj = recoveredMethaneNm3 * input.methaneEnergyMjPerNm3;
    const usefulEnergyMj = methaneEnergyMj * input.projectEnergyEfficiency;
    const baseline = input.baselineEmissionsTco2e ?? 0;
    const project = input.projectEmissionsTco2e ?? 0;
    const emissionReductionsTco2e = baseline - project;
    const canonical = JSON.stringify({ input, recoveredMethaneNm3, methaneEnergyMj, usefulEnergyMj, emissionReductionsTco2e });

    return {
      recoveredMethaneNm3,
      methaneEnergyMj,
      usefulEnergyMj,
      emissionReductionsTco2e,
      calculationHash: crypto.createHash("sha256").update(canonical).digest("hex")
    };
  }
}
