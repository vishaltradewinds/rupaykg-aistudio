const fs = require('fs');
let code = fs.readFileSync('src/services/hederaAnchor.ts', 'utf8');

// Replace getReceipt with getRecord
code = code.replace(/const receipt = await response\.getReceipt\(client\);[\s\S]*?const consensusTimestamp = receipt\.topicSequenceNumber[\s\S]*?: new Date\(\)\.toISOString\(\);/m,
`const record = await response.getRecord(client);
      const receipt = record.receipt;
      const txId = response.transactionId ? response.transactionId.toString() : null;
      const consensusTimestamp = record.consensusTimestamp ? record.consensusTimestamp.toString() : null;
      if (!consensusTimestamp) throw new Error("Did not receive a consensus timestamp from network");`);

fs.writeFileSync('src/services/hederaAnchor.ts', code);
console.log("Hedera anchor patched");
