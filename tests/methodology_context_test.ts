import assert from "node:assert/strict";
import { assertMethodologyContext } from "../src/services/methodologyContext.ts";

for (const context of ["urban", "rural", "mixed"] as const) {
  assert.doesNotThrow(() => assertMethodologyContext({
    context,
    projectId: `fixture-${context}`,
    evidence: [{ id: `e-${context}`, type: "document", sourceHash: "a".repeat(64) }]
  }));
}

assert.throws(() => assertMethodologyContext({
  context: "rural",
  projectId: "fixture-rural",
  evidence: []
}), /at least one evidence reference/);

console.log("Shared methodology context test passed");
