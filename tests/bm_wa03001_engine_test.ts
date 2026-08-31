import assert from "node:assert/strict";
import { BmWa03001Engine } from "../src/services/bmWa03001Engine.ts";

const input = {
  cohorts: [{ year: 2025, wasteTonnes: 1000, docFraction: 0.5, decayRatePerYear: 0.1 }],
  fodParameters: {
    assessmentYear: 2026,
    startYear: 2025,
    docf: 0.5,
    mcf: 0.4,
    methaneFraction: 0.5,
    gwpCh4: 29.8,
    oxidationFactor: 0.1
  },
  baselineMethaneFlaredT: 0,
  oxidationTopLayer: 0.1,
  gwpCh4: 29.8,
  baselineElectricityTco2: 10,
  projectElectricityTco2: 2
} as const;

const result = BmWa03001Engine.calculate(input);
assert.equal(result.fodTraceHash.length, 64);
assert.equal(result.calculationHash.length, 64);
assert.ok(result.projectMethaneT > 0);
assert.equal(result.baselineTotalTco2e, result.baselineMethaneTco2e + 10);
assert.equal(result.projectTotalTco2e, 2);
assert.equal(result.emissionReductionsTco2e, result.baselineTotalTco2e - result.projectTotalTco2e);

assert.throws(
  () => BmWa03001Engine.calculate({ ...input, oxidationTopLayer: 1.1 }),
  /oxidationTopLayer/
);

console.log("BM-WA03.001 canonical adapter test passed");
