const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const regex = /\/\/ ================================\n\s*\/\/ WARD LEVEL GOVERNMENT ANALYTICS\n\s*\/\/ ================================\n\s*app\.get\(\s*\"\/api\/municipal\/ward-analytics\"[\s\S]*?\}\s*\)\s*,\s*\n\s*\)\s*;/g;

// Wait, the block ends with \},\n  \);
// Let's do it manually

let startIndex = code.indexOf('// ================================\n  // WARD LEVEL GOVERNMENT ANALYTICS');
if (startIndex !== -1) {
  let depth = 0;
  let endIndex = -1;
  let foundFunction = false;
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') {
      depth++;
      foundFunction = true;
    }
    if (code[i] === '}') {
      depth--;
      if (foundFunction && depth === 0) {
        // Now find the closing parenthesis and semicolon of the app.get call
        let j = i + 1;
        while(j < code.length) {
          if (code[j] === ';') {
            endIndex = j;
            break;
          }
          j++;
        }
        break;
      }
    }
  }
  if (endIndex !== -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex + 1);
    fs.writeFileSync('server.ts', code);
    console.log("Removed ward analytics API from server.ts");
  } else {
    console.log("Failed to find end index.");
  }
} else {
    console.log("Failed to find start index.");
}

