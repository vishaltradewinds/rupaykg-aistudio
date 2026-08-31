import assert from "node:assert/strict";
import { BmIn02002Engine } from "../src/services/bmIn02002Engine.ts";

const result = BmIn02002Engine.calculate({
  biogasNm3: 1000,
  methaneFraction: 0.6,
  methaneRecoveryEfficiency: 0.9,
  hydrogenYieldKgPerNm3Methane: 2.5,
  baselineEmissionsTco2e: 100,
  projectEmissionsTco2e: 25
});

assert.equal(result.recoveredMethaneNm3, 540);
assert.equal(result.hydrogenKg, 1350);
assert.equal(result.emissionReductionsTco2e, 75);
assert.equal(result.calculationHash.length, 64);

assert.throws(() => BmIn02002Engine.calculate({
  biogasNm3: 1,
  methaneFraction: 1.1,
  methaneRecoveryEfficiency: 1,
  hydrogenYieldKgPerNm3Methane: 2,
  baselineEmissionsTco2e: 1,
  projectEmissionsTco2e: 0
}), /methaneFraction must be a fraction/);

console.log("BM-IN02.002 engine test passed");
