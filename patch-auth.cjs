const fs = require('fs');
let authCode = fs.readFileSync('src/middleware/auth.ts', 'utf8');

authCode = authCode.replace(
  /\/\/\ 3\.\ Fallback:\ decode\ JWT\ payload\ directly[\s\S]*?\/\/\ Decode\ failed\n\s*\}\n\s*\}/g,
  ''
);

fs.writeFileSync('src/middleware/auth.ts', authCode);
console.log("Patched auth");
