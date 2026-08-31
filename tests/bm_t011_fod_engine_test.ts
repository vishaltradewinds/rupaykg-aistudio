import assert from "node:assert/strict";
import { BmT011FodEngine } from "../src/services/bmT011FodEngine.ts";

const result = BmT011FodEngine.calculate(
  [
    { year: 2024, wasteTonnes: 1000, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2025, wasteTonnes: 1200, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2026, wasteTonnes: 1400, docFraction: 0.15, decayRatePerYear: 0.06 }
  ],
  {
    assessmentYear: 2026,
    startYear: 2024,
    docf: 0.5,
    mcf: 0.4,
    methaneFraction: 0.5,
    gwpCh4: 28,
    oxidationFactor: 0.1
  }
);

assert.equal(result.cohortTrace.length, 3);
assert.ok(result.cohortTrace[0].ageYears === 2);
assert.ok(result.cohortTrace[1].ageYears === 1);
assert.ok(result.cohortTrace[2].ageYears === 0);
assert.ok(result.methaneGeneratedT > 0);
assert.ok(result.baselineEmissionsTco2e > 0);
assert.equal(result.calculationHash.length, 64);

const reordered = BmT011FodEngine.calculate(
  [
    { year: 2026, wasteTonnes: 1400, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2024, wasteTonnes: 1000, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2025, wasteTonnes: 1200, docFraction: 0.15, decayRatePerYear: 0.06 }
  ],
  {
    assessmentYear: 2026,
    startYear: 2024,
    docf: 0.5,
    mcf: 0.4,
    methaneFraction: 0.5,
    gwpCh4: 28,
    oxidationFactor: 0.1
  }
);

assert.equal(
  Number(result.methaneGeneratedT.toFixed(10)),
  Number(reordered.methaneGeneratedT.toFixed(10))
);

console.log("BM-T-011 multi-year FOD engine test passed");
