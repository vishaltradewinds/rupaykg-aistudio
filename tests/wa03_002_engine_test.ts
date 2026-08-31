import assert from "node:assert/strict";
import { BmWa03002Engine } from "../src/services/bmWa03002Engine.ts";

const result = BmWa03002Engine.calculate({
  cohorts: [
    { year: 2024, wasteTonnes: 1000, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2025, wasteTonnes: 1200, docFraction: 0.15, decayRatePerYear: 0.06 },
    { year: 2026, wasteTonnes: 1400, docFraction: 0.15, decayRatePerYear: 0.06 }
  ],
  fodParameters: {
    assessmentYear: 2026,
    startYear: 2024,
    docf: 0.5,
    mcf: 0.4,
    methaneFraction: 0.5,
    gwpCh4: 29.8,
    oxidationFactor: 0.1
  },
  baselineMethaneFlaredT: 10,
  oxidationTopLayer: 0.1,
  gwpCh4: 29.8,
  baselineElectricityTco2: 20,
  baselineHeatTco2: 30,
  baselineNaturalGasTco2: 40,
  projectElectricityTco2: 5,
  projectFossilFuelTco2: 3,
  projectTransportTco2: 2,
  projectPipelineTco2: 1
});

assert.equal(result.projectMethaneT > 0, true);
const expectedMethane = ((1 - 0.1) * result.projectMethaneT - 10) * 29.8;
assert.equal(Number(result.baselineMethaneTco2e.toFixed(10)), Number(expectedMethane.toFixed(10)));
assert.equal(result.baselineTotalTco2e, result.baselineMethaneTco2e + 20 + 30 + 40);
assert.equal(result.projectTotalTco2e, 11);
assert.equal(result.emissionReductionsTco2e, result.baselineTotalTco2e - 11);
assert.equal(result.fodTraceHash.length, 64);
assert.equal(result.calculationHash.length, 64);

assert.throws(() => BmWa03002Engine.calculate({
  cohorts: [{ year: 2026, wasteTonnes: 1, docFraction: 0.1, decayRatePerYear: 0.1 }],
  fodParameters: { assessmentYear: 2026, startYear: 2026, docf: 0.5, mcf: 0.4, methaneFraction: 0.5, gwpCh4: 29.8, oxidationFactor: 0.1 },
  baselineMethaneFlaredT: 0,
  oxidationTopLayer: 1.1,
  gwpCh4: 29.8
}), /oxidationTopLayer must be a fraction/);

console.log("BM-WA03.002 canonical engine test passed");
