const fs = require('fs');
let content = fs.readFileSync('tests/two_process_survival_test.ts', 'utf8');
content = content.replace(/eventType: "SURVIVAL_BLOCK"\n  \}, "0\.0\.123456", userId\); \/\/\n  \}\);/g, 'eventType: "SURVIVAL_BLOCK"\n  }, "0.0.123456", userId);');
fs.writeFileSync('tests/two_process_survival_test.ts', content);
