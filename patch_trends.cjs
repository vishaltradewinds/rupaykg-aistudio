const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    `let filteredRecords = filterByJurisdiction(req.user, records, "records");`,
    `let filteredRecords = filterByJurisdiction(req.user, records, "records", req.query);`
);

fs.writeFileSync('server.ts', code);
console.log("Trends patched");
