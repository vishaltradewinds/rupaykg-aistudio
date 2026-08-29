const fs = require('fs');

let content = fs.readFileSync('tests/two_process_survival_test.ts', 'utf8');

content = content.replace(/action: "SURVIVAL_BLOCK",\n    data: \{ weight_kg: 720, ccc_amount_kg: 1080 \},\n    actor: userId,/g, 'eventType: "SURVIVAL_BLOCK"');

fs.writeFileSync('tests/two_process_survival_test.ts', content);

