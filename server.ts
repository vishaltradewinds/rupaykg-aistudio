import express, { Request, Response, NextFunction } from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "rupaykg_sovereign_secret_2026";
const PORT = 3000;

// ==============================================
// DATABASE INITIALIZATION (SQLite -> Expandable to MongoDB)
// ==============================================
const db = new Database("rupaykg_v2.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    organization_name TEXT,
    district TEXT,
    state TEXT,
    wallet_balance REAL DEFAULT 0,
    kyc_status TEXT DEFAULT 'PENDING',
    carbon_credits_owned REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS biomass_records (
    id TEXT PRIMARY KEY,
    citizen_id TEXT NOT NULL,
    aggregator_id TEXT,
    fpo_id TEXT,
    processor_id TEXT,
    weight_kg REAL NOT NULL,
    waste_type TEXT NOT NULL,
    geo_lat REAL,
    geo_long REAL,
    moisture_level REAL,
    validation_status TEXT DEFAULT 'PENDING_MRV',
    carbon_reduction_kg REAL DEFAULT 0,
    recycler_value REAL DEFAULT 0,
    csr_value REAL DEFAULT 0,
    municipal_value REAL DEFAULT 0,
    carbon_value REAL DEFAULT 0,
    epr_value REAL DEFAULT 0,
    total_value REAL DEFAULT 0,
    registry_status TEXT DEFAULT 'UNREGISTERED',
    image_proof TEXT,
    ledger_hash TEXT,
    block_reference TEXT,
    transaction_signature TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS funding_pools (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    csr_pool_balance REAL DEFAULT 1000000,
    epr_pool_balance REAL DEFAULT 1000000,
    municipal_pool_balance REAL DEFAULT 1000000,
    carbon_pool_balance REAL DEFAULT 1000000,
    recycler_pool_balance REAL DEFAULT 1000000
  );

  CREATE TABLE IF NOT EXISTS carbon_registry (
    credit_id TEXT PRIMARY KEY,
    linked_biomass_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    registry_confirmed BOOLEAN DEFAULT 0,
    article6_status TEXT DEFAULT 'PENDING',
    issuance_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (linked_biomass_id) REFERENCES biomass_records(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    compliance_flag BOOLEAN DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Initialize Funding Pools if empty
  INSERT OR IGNORE INTO funding_pools (id) VALUES (1);
`);

// ==============================================
// MIDDLEWARE & AUTHENTICATION
// ==============================================

interface AuthRequest extends Request {
  user?: any;
}

const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user;
    next();
  });
};

const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Requires one of roles: ${roles.join(', ')}` });
    }
    next();
  };
};

// ==============================================
// CORE ENGINES
// ==============================================

const generateLedgerHash = (data: any) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

const runFraudChecks = (userId: string, lat: number, long: number, weight: number, moisture: number) => {
  let isFraud = false;
  let reason = "";

  // 1. Weight Anomaly
  if (weight > 5000) {
    isFraud = true;
    reason = "Weight exceeds maximum threshold (5000kg) for single citizen upload.";
  }
  // 2. Moisture Threshold
  if (moisture > 35) {
    isFraud = true;
    reason = "Moisture level exceeds 35% acceptable limit.";
  }
  // 3. Duplicate Geo (Mock implementation: in prod, query DB for recent uploads at exact geo)
  
  return { isFraud, reason };
};

const calculateMultiRailValue = (weight: number) => {
  // Base rates per kg
  const recycler = weight * 4;
  const csr = weight * 2;
  const municipal = weight * 1;
  const carbon = weight * 3;
  const epr = weight * 2;
  const total = recycler + csr + municipal + carbon + epr;
  const carbon_reduction = weight * 1.8; // kg CO2 equivalent

  return { recycler, csr, municipal, carbon, epr, total, carbon_reduction };
};

// ==============================================
// SERVER SETUP & ROUTES
// ==============================================

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- 1. AUTHENTICATION ---
  app.post("/api/register", async (req: Request, res: Response) => {
    const { name, phone, password, role, organization_name, district, state } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      
      const validRoles = [
        'citizen', 'fpo', 'aggregator', 'processor', 'csr_partner', 
        'epr_partner', 'municipal_admin', 'state_admin', 'carbon_buyer', 
        'regulator', 'super_admin'
      ];
      const userRole = validRoles.includes(role) ? role : 'citizen';
      
      const insert = db.prepare(`
        INSERT INTO users (id, name, phone, password, role, organization_name, district, state) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run(userId, name, phone, hashedPassword, userRole, organization_name, district, state);

      res.json({ message: "User registered successfully", userId, role: userRole });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Phone number already registered" });
      }
      res.status(500).json({ error: "Registration failed", details: error.message });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    const { phone, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: user.name,
      district: user.district,
      state: user.state
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: tokenPayload });
  });

  app.get("/api/me", authenticateToken, (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
  });

  // --- 2. CITIZEN ENDPOINTS ---
  app.post("/api/citizen/upload", authenticateToken, requireRole(['citizen']), (req: AuthRequest, res: Response) => {
    const { weight_kg, waste_type, geo_lat, geo_long, moisture_level = 15, image_proof } = req.body;
    const userId = req.user.id;

    // Fraud Check
    const fraudCheck = runFraudChecks(userId, geo_lat, geo_long, weight_kg, moisture_level);
    const status = fraudCheck.isFraud ? 'UNDER_REVIEW' : 'PENDING_MRV';

    const val = calculateMultiRailValue(weight_kg);
    const recordId = uuidv4();
    
    // Blockchain Ledger Hash
    const ledgerHash = generateLedgerHash({ recordId, userId, weight_kg, timestamp: Date.now() });

    const insertRecord = db.prepare(`
      INSERT INTO biomass_records (
        id, citizen_id, weight_kg, waste_type, geo_lat, geo_long, moisture_level,
        recycler_value, csr_value, municipal_value, carbon_value, epr_value,
        total_value, carbon_reduction_kg, validation_status, image_proof, ledger_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const logAudit = db.prepare("INSERT INTO audit_logs (event_type, actor_role, actor_id, record_id, details, compliance_flag) VALUES (?, ?, ?, ?, ?, ?)");

    db.transaction(() => {
      insertRecord.run(
        recordId, userId, weight_kg, waste_type, geo_lat, geo_long, moisture_level,
        val.recycler, val.csr, val.municipal, val.carbon, val.epr,
        val.total, val.carbon_reduction, status, image_proof, ledgerHash
      );
      logAudit.run("BIOMASS_UPLOADED", req.user.role, userId, recordId, `Uploaded ${weight_kg}kg`, fraudCheck.isFraud ? 1 : 0);
    })();

    res.json({
      message: fraudCheck.isFraud ? "Record flagged for review" : "Biomass recorded successfully",
      record_id: recordId,
      status,
      ledger_hash: ledgerHash
    });
  });

  app.get("/api/citizen/wallet", authenticateToken, requireRole(['citizen']), (req: AuthRequest, res: Response) => {
    const user: any = db.prepare("SELECT wallet_balance, carbon_credits_owned FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // --- 3. AGGREGATOR / PROCESSOR ENDPOINTS ---
  app.post("/api/aggregator/pickup", authenticateToken, requireRole(['aggregator']), (req: AuthRequest, res: Response) => {
    const { record_id } = req.body;
    db.prepare("UPDATE biomass_records SET aggregator_id = ?, validation_status = 'AGGREGATED' WHERE id = ?").run(req.user.id, record_id);
    db.prepare("INSERT INTO audit_logs (event_type, actor_role, actor_id, record_id) VALUES (?, ?, ?, ?)").run("PICKUP_CONFIRMED", req.user.role, req.user.id, record_id);
    res.json({ message: "Pickup confirmed" });
  });

  app.post("/api/processor/receipt", authenticateToken, requireRole(['processor']), (req: AuthRequest, res: Response) => {
    const { record_id } = req.body;
    
    // 1. Update Record
    db.prepare("UPDATE biomass_records SET processor_id = ?, validation_status = 'PROCESSED' WHERE id = ?").run(req.user.id, record_id);
    
    // 2. Trigger Multi-Rail Funding Engine
    const record: any = db.prepare("SELECT * FROM biomass_records WHERE id = ?").get(record_id);
    
    const updatePools = db.prepare(`
      UPDATE funding_pools SET 
        csr_pool_balance = csr_pool_balance - ?,
        epr_pool_balance = epr_pool_balance - ?,
        municipal_pool_balance = municipal_pool_balance - ?,
        carbon_pool_balance = carbon_pool_balance - ?,
        recycler_pool_balance = recycler_pool_balance - ?
      WHERE id = 1
    `);
    
    const updateWallet = db.prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");

    db.transaction(() => {
      updatePools.run(record.csr_value, record.epr_value, record.municipal_value, record.carbon_value, record.recycler_value);
      updateWallet.run(record.total_value, record.citizen_id);
      db.prepare("INSERT INTO audit_logs (event_type, actor_role, actor_id, record_id, details) VALUES (?, ?, ?, ?, ?)").run(
        "FUNDS_DISBURSED", req.user.role, req.user.id, record_id, `Disbursed ₹${record.total_value} across 5 rails`
      );
    })();

    res.json({ message: "Feedstock received and funds disbursed to citizen." });
  });

  // --- 4. REGULATOR / CARBON LOGIC ---
  app.post("/api/regulator/approve-carbon", authenticateToken, requireRole(['regulator', 'super_admin']), (req: AuthRequest, res: Response) => {
    const { record_id } = req.body;
    
    const record: any = db.prepare("SELECT * FROM biomass_records WHERE id = ?").get(record_id);
    if (!record || record.validation_status !== 'PROCESSED') {
      return res.status(400).json({ error: "Record not ready for carbon issuance." });
    }
    if (record.registry_status === 'REGISTERED') {
      return res.status(400).json({ error: "Carbon credit already issued for this record." });
    }

    const creditId = `CC-${uuidv4().substring(0,8).toUpperCase()}`;

    db.transaction(() => {
      db.prepare("INSERT INTO carbon_registry (credit_id, linked_biomass_id, owner_id, registry_confirmed) VALUES (?, ?, ?, 1)").run(
        creditId, record_id, record.citizen_id
      );
      db.prepare("UPDATE biomass_records SET registry_status = 'REGISTERED' WHERE id = ?").run(record_id);
      db.prepare("UPDATE users SET carbon_credits_owned = carbon_credits_owned + ? WHERE id = ?").run(record.carbon_reduction_kg, record.citizen_id);
      db.prepare("INSERT INTO audit_logs (event_type, actor_role, actor_id, record_id, details) VALUES (?, ?, ?, ?, ?)").run(
        "CARBON_CREDIT_ISSUED", req.user.role, req.user.id, record_id, `Issued ${record.carbon_reduction_kg}kg CO2e`
      );
    })();

    res.json({ message: "Carbon Credit Issued", credit_id: creditId });
  });

  // --- 5. ESG & REPORTING MODULE ---
  app.get("/api/report/:type", authenticateToken, requireRole(['csr_partner', 'epr_partner', 'municipal_admin', 'carbon_buyer', 'super_admin']), (req: AuthRequest, res: Response) => {
    const { type } = req.params; // csr, epr, municipal, carbon
    
    const validTypes = ['csr', 'epr', 'municipal', 'carbon'];
    if (!validTypes.includes(type)) return res.status(400).json({ error: "Invalid report type" });

    const valueColumn = `${type}_value`;
    const stats = db.prepare(`
      SELECT 
        COUNT(id) as total_transactions,
        SUM(weight_kg) as total_biomass_kg,
        SUM(carbon_reduction_kg) as total_carbon_mitigated,
        SUM(${valueColumn}) as total_funds_deployed
      FROM biomass_records 
      WHERE validation_status = 'PROCESSED'
    `).get();

    res.json({
      report_type: type.toUpperCase(),
      generated_at: new Date().toISOString(),
      sdg_impact: ["SDG 1: No Poverty", "SDG 13: Climate Action", "SDG 12: Responsible Consumption"],
      metrics: stats
    });
  });

  // --- 6. GEO HIERARCHY DASHBOARDS ---
  app.get("/api/admin/dashboard", authenticateToken, (req: AuthRequest, res: Response) => {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const totalRecords = db.prepare("SELECT COUNT(*) as count FROM biomass_records").get() as any;
    const totalWallet = db.prepare("SELECT SUM(wallet_balance) as sum FROM users").get() as any;
    const totalCarbon = db.prepare("SELECT SUM(carbon_reduction_kg) as sum FROM biomass_records").get() as any;
    const totalWeight = db.prepare("SELECT SUM(weight_kg) as sum FROM biomass_records").get() as any;

    res.json({
      total_users: totalUsers.count,
      total_biomass_records: totalRecords.count,
      total_wallet_disbursed: totalWallet.sum || 0,
      total_carbon_reduction_kg: totalCarbon.sum || 0,
      total_weight_kg: totalWeight.sum || 0
    });
  });

  app.get("/api/dashboard/geo", authenticateToken, requireRole(['state_admin', 'municipal_admin', 'super_admin']), (req: AuthRequest, res: Response) => {
    const { level, name } = req.query; // level: 'district' | 'state', name: 'Pune' | 'Maharashtra'
    
    let query = `
      SELECT 
        COUNT(b.id) as total_records,
        SUM(b.weight_kg) as total_weight,
        SUM(b.carbon_reduction_kg) as total_carbon,
        SUM(b.total_value) as total_wealth_created
      FROM biomass_records b
      JOIN users u ON b.citizen_id = u.id
    `;
    
    let params: any[] = [];
    if (level === 'district') {
      query += " WHERE u.district = ?";
      params.push(name);
    } else if (level === 'state') {
      query += " WHERE u.state = ?";
      params.push(name);
    }

    const stats = db.prepare(query).get(...params);
    res.json({ level, name, stats });
  });

  // --- 7. GENERAL HISTORY & LOGS ---
  app.get("/api/history", authenticateToken, (req: AuthRequest, res: Response) => {
    let records;
    if (req.user.role === 'citizen') {
      records = db.prepare("SELECT * FROM biomass_records WHERE citizen_id = ? ORDER BY timestamp DESC").all(req.user.id);
    } else {
      records = db.prepare("SELECT * FROM biomass_records ORDER BY timestamp DESC LIMIT 100").all();
    }
    res.json(records);
  });

  app.get("/api/audit-logs", authenticateToken, requireRole(['regulator', 'super_admin', 'state_admin']), (req: AuthRequest, res: Response) => {
    const logs = db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
    res.json(logs);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RupayKg CE-OS Server running on http://localhost:${PORT}`);
  });
}

startServer();
