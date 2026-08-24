const fs = require('fs');
let code = fs.readFileSync('src/db/schema.ts', 'utf8');

// Replace all occurrences of uuid('id') with text('id') for consistency in these specific tables
const tablesToFix = [
  'weighbridge_records',
  'landfill_facilities',
  'landfill_compaction_events',
  'instrument_calibrations',
  'instrument_readings',
  'instrument_maintenance',
  'mrv_quality_audit'
];

// Instead of parsing perfectly, we can just replace uuid( with text( for these specific foreign keys and ids.
code = code.replace(/id: uuid\('id'\)\.defaultRandom\(\)\.primaryKey\(\),/g, "id: text('id').primaryKey(),");
code = code.replace(/facilityId: uuid\('facility_id'\)/g, "facilityId: text('facility_id')");
code = code.replace(/sourceRecordId: uuid\('source_record_id'\)/g, "sourceRecordId: text('source_record_id')");
code = code.replace(/landfillFacilityId: uuid\('landfill_facility_id'\)/g, "landfillFacilityId: text('landfill_facility_id')");
code = code.replace(/evidenceId: uuid\('evidence_id'\)/g, "evidenceId: text('evidence_id')");
code = code.replace(/instrumentId: uuid\('instrument_id'\)/g, "instrumentId: text('instrument_id')");

// Need to remove uuid import if unused? Or just leave it.

fs.writeFileSync('src/db/schema.ts', code);
console.log("Patched schema types");
