import assert from "node:assert/strict";
import { METHODOLOGIES } from "../src/services/methodologyRegistry.ts";

assert.equal(METHODOLOGIES.length, 12);
assert.equal(new Set(METHODOLOGIES.map(m => m.id)).size, 12);
for (const methodology of METHODOLOGIES) {
  assert.deepEqual(methodology.contexts, ["urban", "rural", "mixed"]);
  assert.ok(methodology.title.length > 0);
}

console.log("Canonical methodology registry test passed");
