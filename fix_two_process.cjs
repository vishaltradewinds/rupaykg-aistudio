const fs = require('fs');

let content = fs.readFileSync('tests/two_process_reader.ts', 'utf8');

// Replace the HederaAnchorProvider.getRecentAnchors with a direct database query
content = content.replace(/const anchors = await HederaAnchorProvider.getRecentAnchors\(5\);/g, 'const anchors = await db.select().from(dbHederaAnchors).limit(5);');

fs.writeFileSync('tests/two_process_reader.ts', content);

