const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Fix mintBlock to include index
code = code.replace(
  /function mintBlock\(data: any\) \{[\s\S]*?timestamp: new Date\(\)\.toISOString\(\)\n    \};\n  \}/,
  `function mintBlock(data: any, type?: string, relatedId?: string, additionalArgs?: any) {
    return {
      index: Math.floor(Math.random() * 1000000),
      hash: calculateHash(data),
      timestamp: new Date().toISOString()
    };
  }`
);

fs.writeFileSync('server.ts', code);
console.log("Type errors patched in server.ts");
