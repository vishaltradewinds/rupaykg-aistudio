const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `    res.json({ message: "Carbon Credit Certificates (CCCs) successfully minted and distributed to developer's ledger wallet!", certificate: newCert });`;

const replacement = `    res.json({ message: "Verified MRV Audit Payload successfully compiled and ready for National Registry submission!", certificate: newCert });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('Server message patched');
} else {
  console.log('Server target not found');
}
