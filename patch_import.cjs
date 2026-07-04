const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
    `import { WASTE_TYPES, WASTE_CATEGORIES, WasteType } from './constants';`,
    `import { WASTE_TYPES, WASTE_CATEGORIES, WasteType, INDIAN_STATES } from './constants';`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Import patched");
