import crypto from "crypto";
import { BmT011FodEngine, type BmT011Parameters, type BmT011WasteCohort } from "./bmT011FodEngine.ts";

export interface BmWa03001Inputs {
  cohorts: readonly BmT011WasteCohort[];
  fodParameters: Omit<BmT011Parameters, "methaneCaptureFraction"> & {
    methaneCaptureFraction?: number;
  };
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

export interface BmWa03001Result {
  projectMethaneT: number;
  baselineMethaneTco2e: number;
  baselineTotalTco2e: number;
  projectTotalTco2e: number;
  emissionReductionsTco2e: number;
  fodTraceHash: string;
  calculationHash: string;
}

function assertFraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`BM-WA03.001: ${name} must be a fraction between 0 and 1.`);
  }
}

function assertNonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`BM-WA03.001: ${name} must be non-negative.`);
  }
}

/**
 * Canonical BM-WA03.001 integration boundary.
 *
 * BM-WA03.001 requires BM-T-011 for BE_CH4,SWDS,y. This adapter deliberately
 * reuses the canonical BM-T-011 FOD engine and does not create a second FOD
 * implementation. Regulatory equivalence remains evidence-gated until an
 * authoritative or independently reconciled numerical reference fixture exists.
 */
export class BmWa03001Engine {
  public static calculate(input: BmWa03001Inputs): BmWa03001Result {
    assertFraction("oxidationTopLayer", input.oxidationTopLayer);
    assertNonNegative("baselineMethaneFlaredT", input.baselineMethaneFlaredT);
    assertNonNegative("gwpCh4", input.gwpCh4);

    const fodParameters: BmT011Parameters = {
      ...input.fodParameters,
      methaneCaptureFraction: 0
    };
    const fod = BmT011FodEngine.calculate(input.cohorts, fodParameters);
    const projectMethaneT = fod.methaneGeneratedT;

    const baselineMethaneTco2e =
      ((1 - input.oxidationTopLayer) * projectMethaneT - input.baselineMethaneFlaredT) *
      input.gwpCh4;
    const baselineTotalTco2e =
      baselineMethaneTco2e +
      (input.baselineElectricityTco2 ?? 0) +
      (input.baselineHeatTco2 ?? 0) +
      (input.baselineNaturalGasTco2 ?? 0);
    const projectTotalTco2e =
      (input.projectElectricityTco2 ?? 0) +
      (input.projectFossilFuelTco2 ?? 0) +
      (input.projectTransportTco2 ?? 0) +
      (input.projectPipelineTco2 ?? 0);
    const emissionReductionsTco2e = baselineTotalTco2e - projectTotalTco2e;

    const canonical = JSON.stringify({
      input,
      fodHash: fod.calculationHash,
      projectMethaneT,
      baselineMethaneTco2e,
      baselineTotalTco2e,
      projectTotalTco2e,
      emissionReductionsTco2e
    });

    return {
      projectMethaneT: Number(projectMethaneT.toFixed(12)),
      baselineMethaneTco2e: Number(baselineMethaneTco2e.toFixed(12)),
      baselineTotalTco2e: Number(baselineTotalTco2e.toFixed(12)),
      projectTotalTco2e: Number(projectTotalTco2e.toFixed(12)),
      emissionReductionsTco2e: Number(emissionReductionsTco2e.toFixed(12)),
      fodTraceHash: fod.calculationHash,
      calculationHash: crypto.createHash("sha256").update(canonical).digest("hex")
    };
  }
}
