import { db } from "./src/db/index.ts";
import { hedera_anchors } from "./src/db/schema.ts";

async function run() {
  const all = await db.select().from(hedera_anchors);
  console.log("Anchors:", all);
}
run();
