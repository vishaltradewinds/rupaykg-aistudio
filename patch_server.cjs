const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

const importStatement = `import { createAuthRouter, createMeRouter } from "./src/routes/auth.routes.js";\n`;

if (!code.includes('createAuthRouter')) {
    // Insert import after Express import
    code = code.replace('import express from "express";', importStatement + 'import express from "express";');
}

const startIndex = code.indexOf('  app.post("/api/auth/register"');
const endIndex = code.indexOf('  // ---------------- FARMER ROUTES ----------------');

if (startIndex !== -1 && endIndex !== -1) {
    const authDepsString = `
  const getDbStatus = () => dbStatus;
  const authDeps = {
    users,
    getDbStatus,
    User,
    PUBLIC_ROLES,
    ADMIN_ROLES,
    privateKey,
    clientRedis,
    auth
  };

  app.use("/api", createAuthRouter(authDeps));
  app.use("/api/me", createMeRouter(authDeps));
`;
    
    code = code.substring(0, startIndex) + authDepsString + code.substring(endIndex);
    fs.writeFileSync('server.ts', code);
    console.log("Successfully replaced auth routes.");
} else {
    console.log("Could not find start/end indices.");
}
