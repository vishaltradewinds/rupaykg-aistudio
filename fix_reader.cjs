const fs = require('fs');
let content = fs.readFileSync('tests/two_process_reader.ts', 'utf8');
content = content.replace(/console\.log\("Total anchors:", anchors\.length, "Looking for:", manifest\.anchorId, manifest\.anchorHash, "First anchor:", anchors\[0\]\);\n/g, '');
fs.writeFileSync('tests/two_process_reader.ts', content);
