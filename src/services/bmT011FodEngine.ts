import crypto from "crypto";

export interface BmT011WasteCohort {
  year: number;
  wasteTonnes: number;
  docFraction: number;
  decayRatePerYear: number;
}

export interface BmT011Parameters {
  assessmentYear: number;
  startYear: number;
  docf: number;
  mcf: number;
  methaneFraction: number;
  gwpCh4: number;
  oxidationFactor: number;
  /** BM-T-011 model correction factor φ_y. */
  modelCorrectionFactor?: number;
  /** BM-T-011 methane capture fraction f_y. */
  methaneCaptureFraction?: number;
}

export interface BmT011CohortTrace {
  wasteYear: number;
  ageYears: number;
  decayedFraction: number;
  methaneGeneratedT: number;
}

export interface BmT011FodResult {
  methaneGeneratedT: number;
  baselineEmissionsTco2e: number;
  cohortTrace: BmT011CohortTrace[];
  calculationHash: string;
}

function assertFraction(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`BM-T-011: ${name} must be a fraction between 0 and 1.`);
  }
}

function assertPositive(name: string, value: number): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`BM-T-011: ${name} must be strictly positive.`);
  }
}

/**
 * Canonical multi-year first-order-decay calculation boundary for BM-T-011.
 *
 * Each historical waste cohort contributes independently using:
 * W_x * DOC_x * exp(-k_x * (y-x)) * (1-exp(-k_x))
 *
 * Methane conversion applies φ_y, DOCf, MCF, methane carbon fraction (16/12),
 * and methane capture adjustment (1-f_y). Baseline CO2e then applies GWP and
 * oxidation adjustment. Optional φ_y/f_y default only to neutral mathematical
 * values (1/0) for backward-compatible callers; the resolved values are included
 * in the calculation hash.
 */
export class BmT011FodEngine {
  public static calculate(
    cohorts: readonly BmT011WasteCohort[],
    parameters: BmT011Parameters
  ): BmT011FodResult {
    if (!Number.isInteger(parameters.assessmentYear) || !Number.isInteger(parameters.startYear)) {
      throw new Error("BM-T-011: assessmentYear and startYear must be integers.");
    }
    if (parameters.startYear > parameters.assessmentYear) {
      throw new Error("BM-T-011: startYear cannot be after assessmentYear.");
    }
    if (cohorts.length === 0) {
      throw new Error("BM-T-011: at least one historical waste cohort is required.");
    }

    assertFraction("docf", parameters.docf);
    assertFraction("mcf", parameters.mcf);
    assertFraction("methaneFraction", parameters.methaneFraction);
    assertFraction("oxidationFactor", parameters.oxidationFactor);
    assertPositive("gwpCh4", parameters.gwpCh4);

    const modelCorrectionFactor = parameters.modelCorrectionFactor ?? 1;
    const methaneCaptureFraction = parameters.methaneCaptureFraction ?? 0;
    assertFraction("modelCorrectionFactor", modelCorrectionFactor);
    assertFraction("methaneCaptureFraction", methaneCaptureFraction);

    const trace: BmT011CohortTrace[] = [];
    let methaneGeneratedT = 0;

    for (const cohort of cohorts) {
      if (!Number.isInteger(cohort.year)) {
        throw new Error("BM-T-011: cohort year must be an integer.");
      }
      if (cohort.year < parameters.startYear || cohort.year > parameters.assessmentYear) {
        throw new Error(`BM-T-011: cohort year ${cohort.year} is outside the assessment window.`);
      }
      if (!Number.isFinite(cohort.wasteTonnes) || cohort.wasteTonnes < 0) {
        throw new Error("BM-T-011: wasteTonnes must be non-negative.");
      }
      assertFraction("docFraction", cohort.docFraction);
      assertPositive("decayRatePerYear", cohort.decayRatePerYear);

      const ageYears = parameters.assessmentYear - cohort.year;
      const decayedFraction = Math.exp(-cohort.decayRatePerYear * ageYears) *
        (1 - Math.exp(-cohort.decayRatePerYear));
      const methaneForCohort = cohort.wasteTonnes * cohort.docFraction * decayedFraction *
        modelCorrectionFactor * parameters.docf * parameters.mcf *
        (16 / 12) * parameters.methaneFraction * (1 - methaneCaptureFraction);

      methaneGeneratedT += methaneForCohort;
      trace.push({
        wasteYear: cohort.year,
        ageYears,
        decayedFraction: Number(decayedFraction.toFixed(12)),
        methaneGeneratedT: Number(methaneForCohort.toFixed(12))
      });
    }

    const baselineEmissionsTco2e = methaneGeneratedT * parameters.gwpCh4 *
      (1 - parameters.oxidationFactor);

    const canonicalInput = JSON.stringify({
      cohorts,
      parameters: {
        ...parameters,
        modelCorrectionFactor,
        methaneCaptureFraction
      },
      trace,
      methaneGeneratedT: Number(methaneGeneratedT.toFixed(12)),
      baselineEmissionsTco2e: Number(baselineEmissionsTco2e.toFixed(12))
    });

    return {
      methaneGeneratedT: Number(methaneGeneratedT.toFixed(12)),
      baselineEmissionsTco2e: Number(baselineEmissionsTco2e.toFixed(12)),
      cohortTrace: trace,
      calculationHash: crypto.createHash("sha256").update(canonicalInput).digest("hex")
    };
  }
}
