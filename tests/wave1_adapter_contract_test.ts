import assert from "node:assert/strict";
import { WAVE1_METHODOLOGIES, validateWave1Input } from "../src/services/wave1AdapterContracts.ts";

assert.equal(WAVE1_METHODOLOGIES.length, 5);
assert.throws(() => validateWave1Input({
  methodologyId: "BM-WA03.001",
  projectId: "p1",
  context: "urban",
  parameters: { x: Number.NaN },
  evidenceIds: ["e1"]
}), /must be finite/);
assert.throws(() => validateWave1Input({
  methodologyId: "BM-AG04.001",
  projectId: "p2",
  context: "rural",
  parameters: {},
  evidenceIds: []
}), /evidence is required/);
console.log("Wave 1 adapter contract test passed");
