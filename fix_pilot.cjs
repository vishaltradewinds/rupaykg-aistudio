const fs = require('fs');
let content = fs.readFileSync('tests/pilot_persistence_test.ts', 'utf8');
content = content.replace(/  \}, "0\.0\.123456"\); \/\/\n  \}\);/g, '  }, "0.0.123456");');
fs.writeFileSync('tests/pilot_persistence_test.ts', content);
