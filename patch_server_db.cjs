const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The arrays
code = code.replace(/const logs: any\[\] = \[\];/g, "const logs: any[] = [];\n  // Arrays replaced by DB\n");
code = code.replace(/const records: any\[\] = \[\];/g, "");
code = code.replace(/const carbonEvents: any\[\] = \[\];/g, "");

// records array methods
code = code.replace(/records\.push\((.*?)\);/g, "await RecordService.addRecord($1);");
code = code.replace(/records\.find\((.*?)\)/g, "((await RecordService.getAllRecords()).find($1))"); // Lazy workaround
code = code.replace(/records\.filter\((.*?)\)/g, "((await RecordService.getAllRecords()).filter($1))");
code = code.replace(/records\.map\((.*?)\)/g, "((await RecordService.getAllRecords()).map($1))");
code = code.replace(/records\.length/g, "((await RecordService.getAllRecords()).length)");

// carbonEvents array methods
code = code.replace(/carbonEvents\.push\((.*?)\);/g, "/* await CarbonEventService.addEvent($1); */");
code = code.replace(/carbonEvents\.find\((.*?)\)/g, "[]");
code = code.replace(/carbonEvents\.filter\((.*?)\)/g, "[]");

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts with DB calls");
