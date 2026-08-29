const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// fix auditTrailHash
content = content.replace(/auditTrailHash: `0x\$\{Array\.from\(\{ length: 16 \}, \(\) => Math\.floor\(Math\.random\(\) \* 16\)\.toString\(16\)\)\.join\(""\)\}`/g, 'auditTrailHash: "NOT_CONFIGURED"');

// fix cpcbSyncToken
content = content.replace(/cpcbSyncToken: `CPCB-TX-\$\{Date\.now\(\)\}-\$\{Math\.floor\(Math\.random\(\) \* 10000\)\}`/g, 'cpcbSyncToken: "NOT_CONFIGURED"');

fs.writeFileSync('server.ts', content);
