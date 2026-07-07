const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                    {t('RupayKg is hereby defined as: A Sovereign Digital MRV Infrastructure Platform operating under a single national stakeholder architecture with regulator-aligned CCC origination capability.')}`;

const replacement = `                    {t('RupayKg is hereby defined as: India\\'s Circular Economy Operating System, a unified digital platform integrating Waste Management, Digital MRV, and Carbon Accounting under a single national architecture.')}`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log('Definition patched');
} else {
  console.log('Definition target not found');
}
