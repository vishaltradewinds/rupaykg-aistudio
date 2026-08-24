const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/,\s*,\s*async \(req/g, ', async (req');
code = code.replace(/,\s*undefined\s*,\s*async \(req/g, ', async (req');
// Some might just have `app.get("/path", , async (req, res) =>`
code = code.replace(/",\s*,\s*async/g, '", async');

fs.writeFileSync('server.ts', code);
console.log("Fixed double commas");
