const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /app\.use\([\s\n]*helmet\(\{[\s\S]*?\}\),[\s\n]*\);/m;
const newHelmet = `
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://*"]
        }
      } : false,
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      noSniff: true
    })
  );
`;

code = code.replace(regex, newHelmet);
// wait, the old code is:
/*
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled for Vite HMR in Dev
    }),
  );
*/
code = code.replace(/app\.use\(\s*helmet\(\{\s*contentSecurityPolicy:\s*false,?[^\}]*\}\),\s*\);/g, newHelmet.trim());

fs.writeFileSync('server.ts', code);
console.log("Helmet patched");
