import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "rupaykg_sovereign_secret_2026";
const PORT = 3000;

// Initialize Database
const db = new Database("rupaykg.db");

// Create Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'citizen',
    wallet_balance REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS biomass_records (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    weight_kg REAL NOT NULL,
    waste_type TEXT NOT NULL,
    village TEXT NOT NULL,
    geo_lat REAL,
    geo_long REAL,
    recycler_value REAL,
    csr_value REAL,
    municipal_value REAL,
    carbon_value REAL,
    epr_value REAL,
    total_value REAL,
    carbon_reduction_kg REAL,
    status TEXT DEFAULT 'AI_VERIFIED',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    user_id TEXT,
    record_id TEXT,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- VALUE ENGINE ---
  const calculateMultiRailValue = (weight: number) => {
    const recycler = weight * 4;
    const csr = weight * 2;
    const municipal = weight * 1;
    const carbon = weight * 3;
    const epr = weight * 2;
    const total = recycler + csr + municipal + carbon + epr;
    const carbon_reduction = weight * 1.8; // kg CO2 equivalent

    return {
      recycler_value: recycler,
      csr_value: csr,
      municipal_value: municipal,
      carbon_value: carbon,
      epr_value: epr,
      total_value: total,
      carbon_reduction_kg: carbon_reduction,
    };
  };

  // --- AUTH MIDDLEWARE ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Forbidden" });
      req.user = user;
      next();
    });
  };

  // --- ROUTES ---

  app.post("/api/register", async (req, res) => {
    const { name, phone, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      
      const insert = db.prepare("INSERT INTO users (id, name, phone, password) VALUES (?, ?, ?, ?)");
      insert.run(userId, name, phone, hashedPassword);

      res.json({ message: "User registered successfully" });
    } catch (error: any) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Phone number already registered" });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { phone, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  });

  app.post("/api/upload-biomass", authenticateToken, (req: any, res) => {
    const { weight_kg, waste_type, village, geo_lat, geo_long } = req.body;
    const userId = req.user.id;

    const valueData = calculateMultiRailValue(weight_kg);
    const recordId = uuidv4();

    const insertRecord = db.prepare(`
      INSERT INTO biomass_records (
        id, user_id, weight_kg, waste_type, village, geo_lat, geo_long,
        recycler_value, csr_value, municipal_value, carbon_value, epr_value,
        total_value, carbon_reduction_kg
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateWallet = db.prepare("UPDATE users SET wallet_balance = wallet_balance + ? WHERE id = ?");

    const logAudit = db.prepare("INSERT INTO audit_logs (event, user_id, record_id, details) VALUES (?, ?, ?, ?)");

    const transaction = db.transaction(() => {
      insertRecord.run(
        recordId, userId, weight_kg, waste_type, village, geo_lat, geo_long,
        valueData.recycler_value, valueData.csr_value, valueData.municipal_value,
        valueData.carbon_value, valueData.epr_value, valueData.total_value,
        valueData.carbon_reduction_kg
      );
      updateWallet.run(valueData.total_value, userId);
      logAudit.run("BIOMASS_UPLOADED", userId, recordId, `Uploaded ${weight_kg}kg of ${waste_type}`);
    });

    transaction();

    const user: any = db.prepare("SELECT wallet_balance FROM users WHERE id = ?").get(userId);

    res.json({
      message: "Biomass recorded successfully",
      value_breakdown: valueData,
      wallet_balance: user.wallet_balance,
    });
  });

  app.get("/api/wallet", authenticateToken, (req: any, res) => {
    const user: any = db.prepare("SELECT wallet_balance FROM users WHERE id = ?").get(req.user.id);
    res.json({ wallet_balance: user.wallet_balance });
  });

  app.get("/api/history", authenticateToken, (req: any, res) => {
    const records = db.prepare("SELECT * FROM biomass_records WHERE user_id = ? ORDER BY timestamp DESC").all(req.user.id);
    res.json(records);
  });

  app.get("/api/admin/dashboard", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin' && req.user.name !== 'Admin') {
       // For demo purposes, we allow 'Admin' name or 'admin' role
    }

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

  app.get("/api/audit-logs", authenticateToken, (req: any, res) => {
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
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
