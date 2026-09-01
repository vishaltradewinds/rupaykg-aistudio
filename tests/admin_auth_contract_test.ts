import fs from "fs";

const server = fs.readFileSync("server.ts", "utf8");

if (server.includes('process.env.ADMIN_PASSWORD || "admin123"')) {
  throw new Error("SECURITY REGRESSION: insecure admin password fallback remains");
}

if (!server.includes('ADMIN_PASSWORD must be configured with at least 16 characters')) {
  throw new Error("SECURITY REGRESSION: production admin password requirement is missing");
}

if (/user = users\.find\(\(u\) => u\.id === "admin_1"/.test(server)) {
  throw new Error("SECURITY REGRESSION: in-memory admin login fallback remains");
}

console.log("ADMIN_AUTH_CONTRACT: PASS");
