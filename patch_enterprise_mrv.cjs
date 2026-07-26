const fs = require('fs');
let code = fs.readFileSync('src/services/enterpriseMrvService.ts', 'utf-8');

const emptySeed = `
  private seedInitialActivityData() {
    this.mrvEvents = [];
    this.emissionsData = [];
    this.saveToStorage();
  }
`;

code = code.replace(/private seedInitialActivityData\(\) \{[\s\S]*?this\.saveToStorage\(\);\n  \}/, emptySeed.trim());
fs.writeFileSync('src/services/enterpriseMrvService.ts', code);
