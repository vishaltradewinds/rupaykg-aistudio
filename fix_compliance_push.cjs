const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/compliance_await RecordService\.addRecord\(newRecord\);/g, "compliance_records.push(newRecord);");

fs.writeFileSync('server.ts', code);
console.log("Fixed compliance_records.push");
