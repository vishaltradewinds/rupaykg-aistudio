const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

function removeViews(viewName) {
  let modified = true;
  while (modified) {
    modified = false;
    let startIndex = code.indexOf(`{view === '${viewName}'`);
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
        console.log(`Removed a ${viewName} view block.`);
        modified = true;
      }
    }
  }
}

removeViews('municipal');
removeViews('partner');

fs.writeFileSync('src/App.tsx', code);
