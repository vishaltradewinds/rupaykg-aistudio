import crypto from "crypto";
import { BmT011FodEngine, BmT011Parameters, BmT011WasteCohort } from "./bmT011FodEngine.ts";

export interface BmWa03002Inputs {
  cohorts: readonly BmT011WasteCohort[];
  fodParameters: Omit<BmT011Parameters, "methaneCaptureFraction"> & { methaneCaptureFraction?: number };
  projectMethaneT: number;
  baselineMethaneFlaredT: number;
  oxidationTopLayer: number;
  gwpCh4: number;
  baselineElectricityTco2?: number;
  baselineHeatTco2?: number;
  baselineNaturalGasTco2?: number;
  projectElectricityTco2?: number;
  projectFossilFuelTco2?: number;
  projectTransportTco2?: number;
  projectPipelineTco2?: number;
}

export interface BmWa03002Result {
  baselineMethaneTco2e: number;
  baselineTotalTco2e: number;
  projectTotalTco2e: number;
  emissionReductionsTco2e: number;
  fodTraceHash: string;
  calculationHash: string;
}

function fraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(`BM-WA03.002: ${name} must be a fraction between 0 and 1.`);
}

function nonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) throw new Error(`BM-WA03.002: ${name} must be non-negative.`);
}

/**
 * Canonical WA03.002 adapter.
 * BEE Equation (1): BEy = BECH4,y + BEEC,y + BEHG,y + BENG,y.
 * BEE Equation (2): BECH4,y = ((1-OXtop_layer)*FCH4,PJ,y - FCH4,BL,y)*GWPCH4.
 * BEE Equation (26): ERy = BEy - PEy.
 * BM-T-011 supplies BECH4,SWDS,y for the ex-ante FCH4,PJ,y pathway.
 */
export class BmWa03002Engine {
  public static calculate(input: BmWa03002Inputs): BmWa03002Result {
    fraction("oxidationTopLayer", input.oxidationTopLayer);
    nonNegative("projectMethaneT", input.projectMethaneT);
    nonNegative("baselineMethaneFlaredT", input.baselineMethaneFlaredT);
    nonNegative("gwpCh4", input.gwpCh4);

    const fodParameters: BmT011Parameters = {
      ...input.fodParameters,
      methaneCaptureFraction: 0
    };
    const fod = BmT011FodEngine.calculate(input.cohorts, fodParameters);

    const baselineMethaneTco2e = ((1 - input.oxidationTopLayer) * input.projectMethaneT - input.baselineMethaneFlaredT) * input.gwpCh4;
    const baselineTotalTco2e = baselineMethaneTco2e +
      (input.baselineElectricityTco2 ?? 0) +
      (input.baselineHeatTco2 ?? 0) +
      (input.baselineNaturalGasTco2 ?? 0);
    const projectTotalTco2e =
      (input.projectElectricityTco2 ?? 0) +
      (input.projectFossilFuelTco2 ?? 0) +
      (input.projectTransportTco2 ?? 0) +
      (input.projectPipelineTco2 ?? 0);
    const emissionReductionsTco2e = baselineTotalTco2e - projectTotalTco2e;

    const canonical = JSON.stringify({ input, fodHash: fod.calculationHash, baselineMethaneTco2e, baselineTotalTco2e, projectTotalTco2e, emissionReductionsTco2e });
    return {
      baselineMethaneTco2e: Number(baselineMethaneTco2e.toFixed(12)),
      baselineTotalTco2e: Number(baselineTotalTco2e.toFixed(12)),
      projectTotalTco2e: Number(projectTotalTco2e.toFixed(12)),
      emissionReductionsTco2e: Number(emissionReductionsTco2e.toFixed(12)),
      fodTraceHash: fod.calculationHash,
      calculationHash: crypto.createHash("sha256").update(canonical).digest("hex")
    };
  }
}
