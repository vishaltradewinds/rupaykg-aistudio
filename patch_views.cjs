const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The views are wrapped in motion.div
// We can use a script to find and replace them or we can just comment them out using string manipulation

let startIndex = code.indexOf("{view === 'municipal'");
if (startIndex !== -1) {
  let depth = 0;
  let endIndex = -1;
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex !== -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex + 1);
    console.log("Removed municipal view.");
  }
}

startIndex = code.indexOf("{view === 'partner'");
if (startIndex !== -1) {
  let depth = 0;
  let endIndex = -1;
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') {
      depth--;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex !== -1) {
    code = code.substring(0, startIndex) + code.substring(endIndex + 1);
    console.log("Removed partner view.");
  }
}

fs.writeFileSync('src/App.tsx', code);
