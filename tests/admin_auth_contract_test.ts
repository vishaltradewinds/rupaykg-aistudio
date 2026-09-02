import fs from "fs";

const server = fs.readFileSync("server.ts", "utf8");
const usersDb = fs.readFileSync("src/db/users.ts", "utf8");

if (server.includes('process.env.ADMIN_PASSWORD || "admin123"')) {
  throw new Error("SECURITY REGRESSION: insecure admin password fallback remains");
}

if (!usersDb.includes("ADMIN_PASSWORD must be configured with at least 16 characters")) {
  throw new Error("SECURITY REGRESSION: production admin password requirement is missing from DB auth");
}

if (!usersDb.includes("export async function ensureAdminUser()")) {
  throw new Error("SECURITY REGRESSION: deterministic DB admin bootstrap is missing");
}

if (!usersDb.includes("await registerStakeholderUser({")) {
  throw new Error("SECURITY REGRESSION: admin bootstrap does not persist the DB user");
}

if (!usersDb.includes("role: 'super_admin'")) {
  throw new Error("SECURITY REGRESSION: admin bootstrap does not enforce super_admin role");
}

if (!usersDb.includes("normalized === ADMIN_LOGIN_ID")) {
  throw new Error("SECURITY REGRESSION: documented admin login ID is not resolved through DB auth");
}

// The login route must delegate identifier resolution to the DB user service.
const loginStart = server.indexOf('app.post("/api/login"');
if (loginStart < 0) {
  throw new Error("SECURITY REGRESSION: login route is missing");
}
const loginBlock = server.slice(loginStart, loginStart + 4000);
if (!loginBlock.includes("getUserByIdentifier(identifier)")) {
  throw new Error("SECURITY REGRESSION: login route bypasses DB identifier resolution");
}

console.log("ADMIN_AUTH_CONTRACT: PASS");
