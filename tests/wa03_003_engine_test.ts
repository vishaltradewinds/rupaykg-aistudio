import assert from "node:assert/strict";
import { BmWa03003Engine } from "../src/services/bmWa03003Engine.ts";

const result = BmWa03003Engine.calculate({
  biogasNm3: 1000,
  methaneFraction: 0.6,
  methaneRecoveryEfficiency: 0.9,
  methaneEnergyMjPerNm3: 35.8,
  projectEnergyEfficiency: 0.8,
  baselineEmissionsTco2e: 100,
  projectEmissionsTco2e: 20
});

assert.equal(result.recoveredMethaneNm3, 540);
assert.equal(result.methaneEnergyMj, 19332);
assert.equal(result.usefulEnergyMj, 15465.6);
assert.equal(result.emissionReductionsTco2e, 80);
assert.equal(result.calculationHash.length, 64);

assert.throws(() => BmWa03003Engine.calculate({
  biogasNm3: 1,
  methaneFraction: 1.1,
  methaneRecoveryEfficiency: 1,
  methaneEnergyMjPerNm3: 35,
  projectEnergyEfficiency: 1
}), /methaneFraction must be a fraction/);

console.log("BM-WA03.003 engine test passed");
