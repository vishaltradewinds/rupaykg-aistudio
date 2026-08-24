const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Add imports
if (!code.includes("import { db } from './src/db/index.js';") && !code.includes("import { db }")) {
  code = code.replace('import express from "express";', 'import { db } from "./src/db/index.ts";\nimport { records, carbon_events, users } from "./src/db/schema.ts";\nimport { eq, desc } from "drizzle-orm";\nimport express from "express";');
}

// Remove the arrays
code = code.replace(/const records: any\[\] = \[\];/g, '');
code = code.replace(/const carbonEvents: any\[\] = \[\];/g, '');

fs.writeFileSync('server.ts', code);
