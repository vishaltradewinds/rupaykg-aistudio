const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
    `const filteredFarmers = filterByJurisdiction(req.user, farmers, "farmers");`,
    `const filteredFarmers = filterByJurisdiction(req.user, farmers, "farmers", req.query);`
);
code = code.replace(
    `const filteredRecords = filterByJurisdiction(req.user, records, "records");`,
    `const filteredRecords = filterByJurisdiction(req.user, records, "records", req.query);`
);

fs.writeFileSync('server.ts', code);
console.log("Dashboard KPI patched");
