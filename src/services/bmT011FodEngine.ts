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

function assertNonNegative(name: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`BM-T-011: ${name} must be non-negative.`);
  }
}

/**
 * Canonical yearly BM-T-011 first-order-decay calculation boundary.
 *
 * BEE Equation (1):
 * φ_y × (1-f_y) × GWP_CH4 × (1-OX) × 16/12 × F × DOCf × MCF ×
 * Σ_x Σ_j [W_j,x × DOC_j × exp(-k_j(y-x)) × (1-exp(-k_j))]
 *
 * φ_y is a model-correction factor, not a generic fraction; it may be > 1.
 * f_y is the methane capture fraction and remains constrained to [0,1].
 * Defaults are neutral mathematical values only; production callers should
 * supply the BEE-selected φ_y/f_y values for the applicable project.
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
    assertNonNegative("modelCorrectionFactor", modelCorrectionFactor);
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
      assertNonNegative("wasteTonnes", cohort.wasteTonnes);
      assertFraction("docFraction", cohort.docFraction);
      assertPositive("decayRatePerYear", cohort.decayRatePerYear);

      const ageYears = parameters.assessmentYear - cohort.year;
      const decayedFraction = Math.exp(-cohort.decayRatePerYear * ageYears) *
        (1 - Math.exp(-cohort.decayRatePerYear));
      const methaneForCohort = cohort.wasteTonnes * cohort.docFraction * decayedFraction *
        parameters.docf * parameters.mcf * parameters.methaneFraction *
        modelCorrectionFactor * (1 - methaneCaptureFraction);

      methaneGeneratedT += methaneForCohort;
      trace.push({
        wasteYear: cohort.year,
        ageYears,
        decayedFraction: Number(decayedFraction.toFixed(12)),
        methaneGeneratedT: Number(methaneForCohort.toFixed(12))
      });
    }

    const methaneCarbonMassT = methaneGeneratedT * (16 / 12);
    const baselineEmissionsTco2e = methaneCarbonMassT * parameters.gwpCh4 *
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
      methaneCarbonMassT: Number(methaneCarbonMassT.toFixed(12)),
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
