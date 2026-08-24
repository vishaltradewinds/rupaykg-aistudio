const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// Undo the regex replacements from patch_server.cjs
code = code.replace(/await RecordService\.addRecord\(record\);/g, "records.push(record);");
code = code.replace(/await RecordService\.getRecord\((.*?)\)/g, "records.find((r) => r.id === $1)");
code = code.replace(/await RecordService\.getUserRecords\((.*?)\)/g, "records.filter((r) => r.citizen_id === $1)");

fs.writeFileSync('server.ts', code);
console.log("Reverted async DB calls to synchronous array calls to fix build");
