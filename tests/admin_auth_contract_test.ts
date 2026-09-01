import fs from "fs";

const server = fs.readFileSync("server.ts", "utf8");
const users = fs.readFileSync("src/db/users.ts", "utf8");

if (server.includes('process.env.ADMIN_PASSWORD || "admin123"')) {
  throw new Error("SECURITY REGRESSION: insecure admin password fallback remains");
}

if (!server.includes('ADMIN_PASSWORD must be configured with at least 16 characters')) {
  throw new Error("SECURITY REGRESSION: production admin password requirement is missing");
}

if (/user = users\.find\(\(u\) => u\.id === "admin_1"/.test(server)) {
  throw new Error("SECURITY REGRESSION: in-memory admin login fallback remains");
}

if (!users.includes("const adminPassword = process.env.ADMIN_PASSWORD;")) {
  throw new Error("SECURITY REGRESSION: canonical admin password secret is not read by the authoritative user lookup");
}

if (!users.includes("return await registerStakeholderUser({\n        uid: 'admin_1'")) {
  throw new Error("SECURITY REGRESSION: admin password reconciliation path is missing");
}

if (!users.includes("passwordHash = await bcrypt.hash(adminPassword, 10)")) {
  throw new Error("SECURITY REGRESSION: admin password is not bcrypt-hashed before persistence");
}

// Fresh-audit checkpoint: production CI must validate the repaired auth path.
console.log("ADMIN_AUTH_CONTRACT: PASS");
