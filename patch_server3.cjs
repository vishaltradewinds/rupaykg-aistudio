const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const target = `    // Execute Trade
    cert.owner_id = req.user.id;
    cert.status = "active";
    sellOrder.status = "executed";
    sellOrder.buyer_id = req.user.id;
    sellOrder.execution_time = new Date().toISOString();

    res.json({ message: "Trade executed successfully", executed_order: sellOrder, certificate: cert });`;

const replacement = `    // Execute Verification & Transmission
    cert.auditor_id = req.user.id;
    cert.status = "VERIFIED_BY_ACVA";
    sellOrder.status = "verified";
    sellOrder.auditor_id = req.user.id;
    sellOrder.execution_time = new Date().toISOString();

    res.json({ message: "Audit Completed and Payload Transmitted to CCTS Registry successfully", executed_order: sellOrder, certificate: cert });`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.ts', code);
  console.log('Server execute patched');
} else {
  console.log('Server execute target not found');
}
