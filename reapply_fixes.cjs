const fs = require('fs');

let authCode = fs.readFileSync('src/middleware/auth.ts', 'utf8');
authCode = authCode.replace(
  /\/\/\ 3\.\ Fallback:\ decode\ JWT\ payload\ directly[\s\S]*?\/\/\ Decode\ failed\n\s*\}\n\s*\}/g,
  ''
);
fs.writeFileSync('src/middleware/auth.ts', authCode);

let serverCode = fs.readFileSync('server.ts', 'utf8');
serverCode = serverCode.replace(/\|\| "super_internal_token"/g, '');

const authLimiter = `
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 requests per 15 minutes for auth endpoints
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many authentication requests, please try again later." }
  });
  app.use("/api/auth", authLimiter);
  app.use("/api/login", authLimiter);
`;
if (!serverCode.includes('const authLimiter')) {
    serverCode = serverCode.replace(/app\.use\("\/api\/", limiter\);/g, `app.use("/api/", limiter);\n${authLimiter}`);
}
serverCode = serverCode.replace(/origin: "\*"/g, 'origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"]');

fs.writeFileSync('server.ts', serverCode);
console.log("Re-applied P0 and P2 fixes to server.ts and auth.ts");
