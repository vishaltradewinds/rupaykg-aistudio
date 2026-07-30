const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const importStatement = `import { createGeneratorsRouter } from "./src/routes/generators.routes.js";\n`;

if (!code.includes('createGeneratorsRouter')) {
    code = code.replace('import { createAuthRouter, createMeRouter } from "./src/routes/auth.routes.js";', importStatement + 'import { createAuthRouter, createMeRouter } from "./src/routes/auth.routes.js";');
}

const startIndex = code.indexOf('  app.get("/api/generators"');
const endIndex = code.indexOf('  app.get("/api/facilities"');

if (startIndex !== -1 && endIndex !== -1) {
    const depsString = `
  const generatorDeps = {
    generators,
    records,
    contracts,
    compliance_records,
    auth
  };

  app.use("/api/generators", createGeneratorsRouter(generatorDeps));

`;
    
    code = code.substring(0, startIndex) + depsString + code.substring(endIndex);
    fs.writeFileSync('server.ts', code);
    console.log("Successfully replaced generator routes.");
} else {
    console.log("Could not find start/end indices.");
}
