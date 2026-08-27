const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Replace the logout code
const regex = /app\.post\("\/api\/logout"[\s\S]*?\}\);/m;
const newLogout = `app.post("/api/logout", auth(), async (req: any, res) => {
    try {
      const { getRedisClient, isRedisConnected } = require("./src/lib/redis.ts");
      const clientRedis = await getRedisClient();
      if (req.user?.jti && isRedisConnected()) {
         const { exp } = req.user;
         const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 86400; // 24h fallback
         if (ttl > 0) {
            await clientRedis.setEx(\`bl_\${req.user.jti}\`, ttl, "true");
         }
      } else if (!isRedisConnected()) {
         return res.status(503).json({ error: "Cannot revoke token because Redis is offline. Fail closed." });
      }
      res.json({ message: "Logged out successfully" });
    } catch(err) {
      res.status(500).json({ error: "Logout failed" });
    }
  });`;

code = code.replace(regex, newLogout);

// Also remove the old clientRedis initialization
code = code.replace(/const clientRedis: any = null;/g, "");
code = code.replace(/import \{ createClient \} from "redis";/g, "");

fs.writeFileSync('server.ts', code);
console.log("Logout updated");
