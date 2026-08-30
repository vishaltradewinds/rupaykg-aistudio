import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

const server = readFileSync("server.ts", "utf8");
assert.match(server, /environmentalCreditsRouter/);
assert.match(server, /app\.use\("\/api\/v1\/carbon\/depository", environmentalCreditsRouter\)/);
console.log("Environmental credit route mount test: PASS");
