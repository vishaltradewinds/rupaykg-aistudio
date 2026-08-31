import { readFileSync } from "node:fs";

const path = "docs/BM_WA03_002_IMPLEMENTATION_MAPPING.md";
const text = readFileSync(path, "utf8");

const required = [
  "SOURCE_LOCKED / IMPLEMENTATION_MAPPED / NUMERICAL_RECONCILIATION_PENDING",
  "BM-T-004",
  "BM-T-005",
  "BM-T-011",
  "Urban / rural / mixed model",
  "Deterministic trace",
  "CI success does not equal METHOD_RECONCILED",
];

for (const item of required) {
  if (!text.includes(item)) {
    throw new Error(`WA03.002 mapping contract missing: ${item}`);
  }
}

console.log("WA03.002 mapping contract: PASS");
