const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const regex = /          return itemVillage === extraFilters.local_area \|\| userCity === extraFilters.local_area \|\| userVillage === extraFilters.local_area;\n        \}\);\n      \} catch \(err\) \{/m;

const correctAuth = `          return itemVillage === extraFilters.local_area || userCity === extraFilters.local_area || userVillage === extraFilters.local_area;
        });
      }
    }
    return filtered;
  };

  // --- MULTI-GENERATOR PLATFORM STORES ---
  const generators: any[] = [];
  const activeContracts: any[] = [];
  const complianceRecords: any[] = [];
  const pickupSchedules: any[] = [];

  const PUBLIC_ROLES = [
    "citizen",
    "fpo",
    "industry_generator",
    "commercial_generator",
    "institution_generator",
    "municipal_generator"
  ];
  const ADMIN_ROLES = [
    "super_admin",
    "state_admin",
    "municipal_admin",
    "regulator",
    "aggregator",
    "processor",
    "csr_partner",
    "epr_partner",
    "ccc_buyer"
  ];

  const auth = (roles: string[] = []) => {
    return (req: any, res: any, next: any) => {
      const authHeader = req.headers.authorization;
      if (!authHeader)
        return res.status(401).json({ error: "No token provided" });
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
      } catch (err) {`;

code = code.replace(regex, correctAuth);

// Now we need to add the start of /api/auth/register
const regexRegister = /      \} catch \(err\) \{\n        return res\n          \.status\(401\)\n          \.json\(\{ error: "Invalid or expired administrator token" \}\);\n      \}\n    \}\n\n    if \(!PUBLIC_ROLES/m;

const correctRegister = `      } catch (err) {
        return res
          .status(401)
          .json({ error: "Invalid or expired administrator token" });
      }
    };
  };

  app.post("/api/auth/register", async (req: any, res) => {
    const { phone, password, role, name, district, state, organization_name, village, local_area } = req.body;

    if (!PUBLIC_ROLES`;

code = code.replace(regexRegister, correctRegister);

fs.writeFileSync('server.ts', code);
console.log("Server auth fixed");
