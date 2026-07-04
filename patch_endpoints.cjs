const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// api/admin/kpi
code = code.replace(
    `let filteredRecords = filterByJurisdiction(req.user, records, "records");`,
    `let filteredRecords = filterByJurisdiction(req.user, records, "records", req.query);`
);
code = code.replace(
    `const total_users = users.length;`,
    `const total_users = filterByJurisdiction(req.user, users, "users", req.query).length;`
);

// api/admin/fraud-map
code = code.replace(
    `let filteredRecords = filterByJurisdiction(req.user, records, "records");\n      if (context && context !== "all") {`,
    `let filteredRecords = filterByJurisdiction(req.user, records, "records", req.query);\n      if (context && context !== "all") {`
);

// api/carbon/dashboard
code = code.replace(
    `let carbonData = filterByJurisdiction(req.user, carbonProjects, "carbon");`,
    `let carbonData = filterByJurisdiction(req.user, carbonProjects, "carbon", req.query);`
);

fs.writeFileSync('server.ts', code);
console.log("Endpoints patched");
