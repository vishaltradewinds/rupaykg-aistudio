const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(/  \}\);\n      \}\n      const verification = CredentialService\.verifyCredential\([\s\S]*?\}\);\n    \} catch \(err: any\) \{\n      res\.status\(500\)\.json\(\{ error: "Credential verification failed", details: err\.message \}\);\n    \}\n  \}\);/m, 
`  });`);

fs.writeFileSync('server.ts', code);
console.log("Syntax 5 fixed");
