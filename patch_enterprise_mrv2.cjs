const fs = require('fs');
let code = fs.readFileSync('src/services/enterpriseMrvService.ts', 'utf-8');

function emptySeed() {
  let startIndex = code.indexOf('private seedInitialActivityData() {');
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
      code = code.substring(0, startIndex) + "private seedInitialActivityData() {\n    this.mrvEvents = [];\n    this.emissionsData = [];\n    this.evidenceRecords = [];\n    this.evidencePackages = [];\n    this.massBalances = [];\n    this.alerts = [];\n  }" + code.substring(endIndex + 1);
      console.log(`Replaced seedInitialActivityData.`);
    }
  }
}

emptySeed();
fs.writeFileSync('src/services/enterpriseMrvService.ts', code);
