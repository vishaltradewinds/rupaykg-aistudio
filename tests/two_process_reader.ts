import { db } from "../src/db/index.ts";
process.env.HEDERA_TOPIC_ID = "0.0.123456";
import { hedera_anchors as dbHederaAnchors } from "../src/db/schema";
import { RecordService } from '../src/services/recordService.ts';
import { FarmerService } from '../src/services/farmerService.ts';
import { CarbonEventService } from '../src/services/carbonEventService.ts';
import { ComplianceService } from '../src/services/complianceService.ts';
import { PilotService } from '../src/services/pilotService.ts';
import { AuditLogService } from '../src/services/auditLogService.ts';
import { HederaAnchorProvider } from '../src/services/hederaAnchor.ts';
import { getUser } from '../src/db/users.ts';
import fs from 'fs';

async function process2Reader() {
  console.log(`[PROCESS 2 - PID ${process.pid}] Starting fresh process read verification from PostgreSQL...`);
  if (!fs.existsSync('./tests/.survival_manifest.json')) {
    throw new Error("Missing ./tests/.survival_manifest.json from Process 1");
  }

  const manifest = JSON.parse(fs.readFileSync('./tests/.survival_manifest.json', 'utf-8'));
  console.log("Loaded Process 1 manifest:", manifest);

  const results: Array<{ service: string; id: string; before: string; after: string; result: string }> = [];

  // 1. User
  const u = await getUser(manifest.userId);
  if (!u || u.uid !== manifest.userId) throw new Error("User failed survival");
  results.push({ service: "UserService", id: manifest.userId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 2. RecordService
  const rec = await RecordService.getRecord(manifest.recordId);
  if (!rec || rec.id !== manifest.recordId || rec.weight_kg !== 720) throw new Error("RecordService failed survival");
  results.push({ service: "RecordService", id: manifest.recordId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 3. FarmerService
  const farm = await FarmerService.getFarmer(manifest.farmerId);
  if (!farm || farm.id !== manifest.farmerId || farm.name !== "Hardev Singh") throw new Error("FarmerService failed survival");
  results.push({ service: "FarmerService", id: manifest.farmerId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 4. CarbonEventService
  const events = await CarbonEventService.getAllCarbonEvents();
  const ev = events.find((e: any) => e.recordId === manifest.recordId || e.record_id === manifest.recordId);
  if (!ev) throw new Error("CarbonEventService failed survival");
  results.push({ service: "CarbonEventService", id: manifest.carbonEventId || manifest.recordId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 5. ComplianceService
  const comps = await ComplianceService.getAllRecords();
  const comp = comps.find((c: any) => c.id === manifest.complianceId);
  if (!comp) throw new Error("ComplianceService failed survival");
  results.push({ service: "ComplianceService", id: manifest.complianceId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 6. PilotService
  const pilots = await PilotService.getAllOnboardings();
  const pilot = pilots.find((p: any) => p.id === manifest.pilotId);
  if (!pilot) throw new Error("PilotService failed survival");
  results.push({ service: "PilotService", id: manifest.pilotId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 7. AuditLogService
  const logs = await AuditLogService.getLogs(50);
  const log = logs.find((l: any) => l.id === manifest.auditLogId);
  if (!log) throw new Error("AuditLogService failed survival");
  results.push({ service: "AuditLogService", id: manifest.auditLogId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  // 8. HederaAnchorProvider
  const anchors = await db.select().from(dbHederaAnchors);
    const anchor = anchors.find((a: any) => a.id === manifest.anchorId || a.payloadHash === manifest.anchorHash);
  if (!anchor) throw new Error("HederaAnchorProvider failed survival");
  results.push({ service: "HederaAnchorProvider", id: manifest.anchorId, before: "PERSISTED (P1)", after: "FETCHED (P2)", result: "PASS" });

  console.log("\n=======================================================");
  console.log("SERVICE | ID | BEFORE RESTART | AFTER RESTART | RESULT");
  console.log("-------------------------------------------------------");
  for (const r of results) {
    console.log(`${r.service.padEnd(20)} | ${r.id.padEnd(30)} | ${r.before.padEnd(14)} | ${r.after.padEnd(13)} | ${r.result}`);
  }
  console.log("=======================================================\n");

  process.exit(0);
}

process2Reader().catch((err) => {
  console.error("[PROCESS 2 FAILED]", err);
  process.exit(1);
});
