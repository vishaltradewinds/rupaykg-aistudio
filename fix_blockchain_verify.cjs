const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const replacement = `      const recalculatedHash = calculateHash(
        { index: currentBlock.index, timestamp: currentBlock.timestamp, data: currentBlock.data, previousHash: currentBlock.previousHash }
      );`;

code = code.replace(/      const recalculatedHash = calculateHash\(\n        currentBlock\.index,\n        currentBlock\.timestamp,\n        currentBlock\.data,\n        currentBlock\.previousHash,\n      \);/m, replacement);

fs.writeFileSync('server.ts', code);
console.log("Blockchain verify fixed in server.ts");
