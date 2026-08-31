import assert from "node:assert/strict";
import { BmT011FodEngine } from "../src/services/bmT011FodEngine.ts";

const baseCohorts = [
  { year: 2024, wasteTonnes: 1000, docFraction: 0.15, decayRatePerYear: 0.06 },
  { year: 2025, wasteTonnes: 1200, docFraction: 0.15, decayRatePerYear: 0.06 },
  { year: 2026, wasteTonnes: 1400, docFraction: 0.15, decayRatePerYear: 0.06 }
] as const;

const baseParameters = {
  assessmentYear: 2026,
  startYear: 2024,
  docf: 0.5,
  mcf: 0.4,
  methaneFraction: 0.5,
  gwpCh4: 28,
  oxidationFactor: 0.1
};

const result = BmT011FodEngine.calculate(baseCohorts, baseParameters);

assert.equal(result.cohortTrace.length, 3);
assert.ok(result.cohortTrace[0].ageYears === 2);
assert.ok(result.cohortTrace[1].ageYears === 1);
assert.ok(result.cohortTrace[2].ageYears === 0);
assert.ok(result.methaneGeneratedT > 0);
assert.ok(result.baselineEmissionsTco2e > 0);
assert.equal(result.calculationHash.length, 64);

const reordered = BmT011FodEngine.calculate(
  [baseCohorts[2], baseCohorts[0], baseCohorts[1]],
  baseParameters
);

assert.equal(
  Number(result.methaneGeneratedT.toFixed(10)),
  Number(reordered.methaneGeneratedT.toFixed(10))
);

const corrected = BmT011FodEngine.calculate(baseCohorts, {
  ...baseParameters,
  modelCorrectionFactor: 0.8,
  methaneCaptureFraction: 0.25
});

assert.equal(
  Number(corrected.methaneGeneratedT.toFixed(10)),
  Number((result.methaneGeneratedT * 0.8 * 0.75).toFixed(10))
);
assert.equal(
  Number(corrected.baselineEmissionsTco2e.toFixed(10)),
  Number((result.baselineEmissionsTco2e * 0.8 * 0.75).toFixed(10))
);
assert.notEqual(corrected.calculationHash, result.calculationHash);

assert.throws(
  () => BmT011FodEngine.calculate(baseCohorts, {
    ...baseParameters,
    methaneCaptureFraction: 1.01
  }),
  /methaneCaptureFraction must be a fraction/
);

assert.throws(
  () => BmT011FodEngine.calculate(baseCohorts, {
    ...baseParameters,
    modelCorrectionFactor: -0.01
  }),
  /modelCorrectionFactor must be a fraction/
);

console.log("BM-T-011 multi-year FOD engine test passed");
