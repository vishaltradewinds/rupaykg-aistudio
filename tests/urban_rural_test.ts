import { RecordService } from '../src/services/recordService.ts';
import { db } from '../src/db/index.ts';
import { records } from '../src/db/schema.ts';
import { registerStakeholderUser } from '../src/db/users.ts';
import { eq } from 'drizzle-orm';

async function testUrbanAndRuralPersistence() {
  const ts = Date.now();
  console.log("=== VERIFYING URBAN & RURAL TRANSACTION PERSISTENCE IN POSTGRESQL ===");

  // Create valid user records for the FK requirement
  const urbanUserUid = `urban_user_${ts}`;
  await registerStakeholderUser({
    uid: urbanUserUid,
    email: `urban_${ts}@rupaykg.org`,
    name: "Urban ULB Operator",
    role: "ulb_admin",
    state: "Madhya Pradesh",
    district: "Bhopal"
  });

  const ruralUserUid = `rural_user_${ts}`;
  await registerStakeholderUser({
    uid: ruralUserUid,
    email: `rural_${ts}@rupaykg.org`,
    name: "Rural FPO Lead",
    role: "farmer",
    state: "Punjab",
    district: "Ludhiana",
    village: "Khamanon"
  });

  // 1. Urban Transaction
  const urbanId = `rec_urban_${ts}`;
  const urbanRec = await RecordService.addRecord({
    id: urbanId,
    citizen_id: urbanUserUid,
    waste_type: 'Dry Municipal Recyclables',
    weight_kg: 1250,
    context: 'urban',
    village: 'Bhopal Ward 14',
    status: 'verified',
    mrv_status: 'verified',
    total_value: 18750,
    ccc_amount_kg: 1250,
    potential_ccc_value: 6250
  });

  if (!urbanRec || urbanRec.id !== urbanId) throw new Error("Urban record creation failed");
  const dbUrban = await db.select().from(records).where(eq(records.id, urbanId));
  if (!dbUrban || dbUrban.length === 0) throw new Error("Urban record not found in PostgreSQL");
  console.log(`✓ Urban transaction persisted: ${urbanId} (${urbanRec.waste_type}, context: ${urbanRec.context})`);

  // 2. Rural Transaction
  const ruralId = `rec_rural_${ts}`;
  const ruralRec = await RecordService.addRecord({
    id: ruralId,
    citizen_id: ruralUserUid,
    waste_type: 'Paddy Straw Biomass',
    weight_kg: 3400,
    context: 'rural',
    village: 'Khamanon',
    status: 'verified',
    mrv_status: 'verified',
    total_value: 51000,
    ccc_amount_kg: 5100,
    potential_ccc_value: 25500
  });

  if (!ruralRec || ruralRec.id !== ruralId) throw new Error("Rural record creation failed");
  const dbRural = await db.select().from(records).where(eq(records.id, ruralId));
  if (!dbRural || dbRural.length === 0) throw new Error("Rural record not found in PostgreSQL");
  console.log(`✓ Rural transaction persisted: ${ruralId} (${ruralRec.waste_type}, context: ${ruralRec.context})`);

  console.log("✓ Unified Authoritative PostgreSQL Persistence confirmed for both Urban & Rural modes.");
  process.exit(0);
}

testUrbanAndRuralPersistence().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
