const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Replace array declarations
code = code.replace(/const records: any\[\] = \[\];/g, "import { RecordService } from './src/services/recordService';");
code = code.replace(/const carbonEvents: any\[\] = \[\];/g, "import { CarbonEventService } from './src/services/carbonEventService';");

// Replace records.push(record) with await RecordService.addRecord(record)
code = code.replace(/records\.push\(record\);/g, "await RecordService.addRecord(record);");

// Replace records.find with await RecordService.getRecord
// Example: const record = records.find((r) => r.id === record_id);
code = code.replace(/records\.find\(\(r\) => r\.id === (.*?)\)/g, "await RecordService.getRecord($1)");

// Replace records.filter with await RecordService.getUserRecords
// Example: const userRecords = records.filter((r) => r.citizen_id === req.user.id);
code = code.replace(/records\.filter\(\(r\) => r\.citizen_id === (.*?)\)/g, "await RecordService.getUserRecords($1)");

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with DB services");
