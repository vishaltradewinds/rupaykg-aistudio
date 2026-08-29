import { RecordService } from '../src/services/recordService.ts';
import { FarmerService } from '../src/services/farmerService.ts';
import { CarbonEventService } from '../src/services/carbonEventService.ts';
import { ComplianceService } from '../src/services/complianceService.ts';
import { PilotService } from '../src/services/pilotService.ts';
import { AuditLogService } from '../src/services/auditLogService.ts';
import { HederaAnchorProvider } from '../src/services/hederaAnchor.ts';
import { registerStakeholderUser } from '../src/db/users.ts';
import fs from 'fs';

async function process1Writer() {
  const ts = Date.now();
  console.log(`[PROCESS 1 - PID ${process.pid}] Starting write operations to PostgreSQL...`);

  const userId = `user_p1_${ts}`;
  await registerStakeholderUser({
    uid: userId,
    email: `p1_${ts}@rupaykg.org`,
    name: "P1 Farmer",
    role: "farmer",
    phone: `+91988${Math.floor(100000 + Math.random() * 900000)}`,
    state: "Punjab",
    district: "Ludhiana",
    village: "Khamanon",
  });

  const recordId = `rec_p1_${ts}`;
  const rec = await RecordService.addRecord({
    id: recordId,
    citizen_id: userId,
    waste_type: "Paddy Straw Biomass",
    weight_kg: 720,
    village: "Khamanon",
    status: "verified",
    mrv_status: "verified",
    total_value: 10800,
    ccc_amount_kg: 1080,
    potential_ccc_value: 5400,
  });

  const farmerId = `farm_p1_${ts}`;
  const farmer = await FarmerService.addFarmer({
    id: farmerId,
    name: "Hardev Singh",
    phone: `+91977${Math.floor(100000 + Math.random() * 900000)}`,
    state: "Punjab",
    district: "Ludhiana",
    village: "Khamanon",
    land_area_acres: 25.0,
    primary_crop: "Paddy",
    created_by: userId,
  });

  const carbonEvent = await CarbonEventService.addCarbonEvent({
    event_type: "BIOMASS_VALORIZATION",
    quantity_kg: 720,
    amount_tco2e: 1.08,
    recordId: recordId,
    village: "Khamanon",
    district: "Ludhiana",
    state: "Punjab",
    stakeholder_chain: [userId],
  });

  const compliance = await ComplianceService.addRecord({
    entity_id: `facility_p1_${ts}`,
    compliance_type: "EPR_PLASTIC",
    reporting_period: "2026-Q2",
    status: "COMPLIANT",
    target_quantity: 120,
    achieved_quantity: 120,
    verified_by: userId,
  });

  const pilot = await PilotService.addOnboarding({
    pilot_name: "Process 1 Survival Pilot",
    pilot_type: "RURAL_FPO",
    location: { district: "Ludhiana", state: "Punjab" },
    status: "ACTIVE",
    baselineData: { phone: "+919811199999", role: "fpo_lead" }
  });

  const auditLog = await AuditLogService.log(
    "PROCESS_1_WRITE",
    `Process 1 generated persistence record for ${ts}`,
    "INFO",
    userId,
    { timestamp: ts }
  );

  const anchor = await HederaAnchorProvider.submitAnchor({
    recordId: recordId,
    eventType: "SURVIVAL_BLOCK"
  }, "0.0.123456", userId);

  const manifest = {
    userId,
    recordId: rec.id,
    farmerId: farmer.id,
    carbonEventId: carbonEvent.id,
    complianceId: compliance.id,
    pilotId: pilot.id,
    auditLogId: auditLog.id,
    anchorId: anchor.id,
    anchorHash: anchor.integrityHash
  };

  fs.writeFileSync('./tests/.survival_manifest.json', JSON.stringify(manifest, null, 2));
  console.log(`[PROCESS 1 - PID ${process.pid}] Successfully wrote all entities to PostgreSQL and saved manifest.`);
  process.exit(0);
}

process1Writer().catch((err) => {
  console.error("[PROCESS 1 FAILED]", err);
  process.exit(1);
});
