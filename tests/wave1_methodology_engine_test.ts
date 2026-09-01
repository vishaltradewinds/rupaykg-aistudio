import assert from "node:assert/strict";
import { runWave1Methodology } from "../src/services/wave1MethodologyEngine.ts";

const context = {
  context: "rural" as const,
  projectId: "wave1-fixture",
  evidence: [{ id: "e1", type: "facility" as const, sourceHash: "a".repeat(64) }]
};

const ag = runWave1Methodology(context, {
  manureQuantityT: 10,
  volatileSolidsKgPerT: 100,
  methanePotentialM3PerKgVs: 0.2,
  methaneRecoveryEfficiency: 0.5,
  methaneDensityTPerM3: 0.000716,
  baselineEmissionsTco2e: 10,
  projectEmissionsTco2e: 2
}, "BM-AG04.001");
assert.equal(ag.methodologyId, "BM-AG04.001");

const in02 = runWave1Methodology(context, {
  biogasNm3: 100,
  methaneFraction: 0.5,
  methaneRecoveryEfficiency: 0.8,
  hydrogenYieldKgPerNm3Methane: 2,
  baselineEmissionsTco2e: 10,
  projectEmissionsTco2e: 3
}, "BM-IN02.002");
assert.equal(in02.methodologyId, "BM-IN02.002");

const wa001 = runWave1Methodology(context, {
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
}, "BM-WA03.001");
assert.equal(wa001.methodologyId, "BM-WA03.001");
if (wa001.methodologyId !== "BM-WA03.001") {
  throw new Error("Wave 1 dispatcher returned the wrong methodology for the WA03.001 fixture.");
}
assert.ok(wa001.result.projectMethaneT > 0);
assert.equal(wa001.result.projectTotalTco2e, 2);

const wa = runWave1Methodology(context, {
  biogasNm3: 100,
  methaneFraction: 0.5,
  methaneRecoveryEfficiency: 0.8,
  methaneEnergyMjPerNm3: 35,
  projectEnergyEfficiency: 0.8,
  baselineEmissionsTco2e: 10,
  projectEmissionsTco2e: 1
}, "BM-WA03.003");
assert.equal(wa.methodologyId, "BM-WA03.003");

assert.throws(() => runWave1Methodology({ ...context, evidence: [] }, {
  manureQuantityT: 1,
  volatileSolidsKgPerT: 1,
  methanePotentialM3PerKgVs: 1,
  methaneRecoveryEfficiency: 1,
  methaneDensityTPerM3: 0.001,
  baselineEmissionsTco2e: 1,
  projectEmissionsTco2e: 0
}, "BM-AG04.001"), /evidence/);

console.log("Wave 1 canonical dispatcher test passed");
