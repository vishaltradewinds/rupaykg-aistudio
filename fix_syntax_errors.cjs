const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
const lines = code.split('\n');

// Look around line 1892, 1972, etc. and fix syntax
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('((await RecordService.getAllRecords())')) {
    // This was from patch_server_db.cjs. We can just revert it to arrays!
    lines[i] = lines[i].replace(/\(\(await RecordService\.getAllRecords\(\)\)\.find\((.*?)\)\)/g, 'records.find($1)');
    lines[i] = lines[i].replace(/\(\(await RecordService\.getAllRecords\(\)\)\.filter\((.*?)\)\)/g, 'records.filter($1)');
    lines[i] = lines[i].replace(/\(\(await RecordService\.getAllRecords\(\)\)\.map\((.*?)\)\)/g, 'records.map($1)');
    lines[i] = lines[i].replace(/\(\(await RecordService\.getAllRecords\(\)\)\.length\)/g, 'records.length');
  }
}

code = lines.join('\n');
fs.writeFileSync('server.ts', code);
console.log("Reverted RecordService lazy replacements");
