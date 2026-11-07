import { Client } from "pg";

const url = process.env.G002_RUNTIME_DATABASE_URL;
if (!url) {
  console.log("SKIP G002 runtime A/B rehearsal: G002_RUNTIME_DATABASE_URL not configured");
  process.exit(0);
}

const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";
const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

await client.connect();
try {
  await client.query("BEGIN");
  const a = await client.query(
    "INSERT INTO activities (organization_id,activity_type,status,metadata) VALUES ($1,'G002_A','DRAFT',$2::jsonb) RETURNING id",
    [A, JSON.stringify({ g002: "A" })]
  );
  const b = await client.query(
    "INSERT INTO activities (organization_id,activity_type,status,metadata) VALUES ($1,'G002_B','DRAFT',$2::jsonb) RETURNING id",
    [B, JSON.stringify({ g002: "B" })]
  );

  await client.query("SELECT set_config('app.organization_id',$1,true)", [A]);
  const own = await client.query("SELECT count(*)::int AS n FROM activities WHERE organization_id=$1", [A]);
  const foreign = await client.query("SELECT count(*)::int AS n FROM activities WHERE id=$1", [b.rows[0].id]);

  if (Number(own.rows[0].n) !== 1) throw new Error("G-002 A cannot read its own row");
  if (Number(foreign.rows[0].n) !== 0) throw new Error("G-002 A can read B row");

  await client.query("SELECT set_config('app.organization_id',$1,true)", [B]);
  const ownB = await client.query("SELECT count(*)::int AS n FROM activities WHERE organization_id=$1", [B]);
  const foreignB = await client.query("SELECT count(*)::int AS n FROM activities WHERE id=$1", [a.rows[0].id]);

  if (Number(ownB.rows[0].n) !== 1) throw new Error("G-002 B cannot read its own row");
  if (Number(foreignB.rows[0].n) !== 0) throw new Error("G-002 B can read A row");

  await client.query("ROLLBACK");
  console.log("PASS G-002 two-organization runtime isolation A/B");
} catch (error) {
  try { await client.query("ROLLBACK"); } catch {}
  throw error;
} finally {
  await client.end();
}
