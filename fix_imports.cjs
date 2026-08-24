const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Find imports that are inside functions and move them or remove them.
code = code.replace(/import { RecordService } from '\.\/src\/services\/recordService';/g, '');
code = code.replace(/import { CarbonEventService } from '\.\/src\/services\/carbonEventService';/g, '');

fs.writeFileSync('server.ts', code);
console.log("Fixed misplaced imports");
