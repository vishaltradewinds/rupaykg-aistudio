import assert from "node:assert/strict";
import { BmAg04001Engine } from "../src/services/bmAg04001Engine.ts";

const result = BmAg04001Engine.calculate({
  manureQuantityT: 100,
  volatileSolidsKgPerT: 200,
  methanePotentialM3PerKgVs: 0.3,
  methaneRecoveryEfficiency: 0.8,
  methaneDensityTPerM3: 0.000716,
  baselineEmissionsTco2e: 50,
  projectEmissionsTco2e: 10
});

assert.equal(result.methanePotentialM3, 6000);
assert.equal(result.recoveredMethaneM3, 4800);
assert.equal(result.recoveredMethaneT, 3.4368);
assert.equal(result.emissionReductionsTco2e, 40);
assert.equal(result.calculationHash.length, 64);

assert.throws(() => BmAg04001Engine.calculate({
  manureQuantityT: 1,
  volatileSolidsKgPerT: 1,
  methanePotentialM3PerKgVs: 1,
  methaneRecoveryEfficiency: 2,
  methaneDensityTPerM3: 0.001,
  baselineEmissionsTco2e: 1,
  projectEmissionsTco2e: 0
}), /methaneRecoveryEfficiency must be a fraction/);

console.log("BM-AG04.001 engine test passed");
