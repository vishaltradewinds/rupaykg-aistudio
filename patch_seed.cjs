const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

function emptyArray(arrayName) {
  const regex = new RegExp(`const ${arrayName}: any\\[\\] = \\[[\\s\\S]*?\\];`);
  if (regex.test(code)) {
    code = code.replace(regex, `const ${arrayName}: any[] = [];`);
    console.log(`Emptied ${arrayName}.`);
  } else {
    // try let
    const regexLet = new RegExp(`let ${arrayName}: any\\[\\] = \\[[\\s\\S]*?\\];`);
    if (regexLet.test(code)) {
      code = code.replace(regexLet, `let ${arrayName}: any[] = [];`);
      console.log(`Emptied ${arrayName} (let).`);
    } else {
      // try without : any[]
      const regexAny = new RegExp(`const ${arrayName} = \\[[\\s\\S]*?\\];`);
      if (regexAny.test(code)) {
        code = code.replace(regexAny, `const ${arrayName} = [];`);
        console.log(`Emptied ${arrayName} (untyped).`);
      } else {
        console.log(`Could not find ${arrayName}.`);
      }
    }
  }
}

emptyArray('carbonProjects');
emptyArray('projectDesignDocuments');
emptyArray('greenBonds');
emptyArray('guardianPolicies');
emptyArray('mockSensors');
emptyArray('cpcbBwgLogs');

fs.writeFileSync('server.ts', code);
