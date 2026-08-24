const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/origin: process\.env\.ALLOWED_ORIGINS \? process\.env\.ALLOWED_ORIGINS\.split\(\",\"\) : \[\"http:\/\/localhost:3000\"\]\*\",/g, 'origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"],');
fs.writeFileSync('server.ts', code);
console.log("Patched cors");
