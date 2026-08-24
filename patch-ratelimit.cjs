const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

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

code = code.replace(/app\.use\("\/api\/", limiter\);/g, `app.use("/api/", limiter);\n${authLimiter}`);
fs.writeFileSync('server.ts', code);
console.log("Patched rate limits");
