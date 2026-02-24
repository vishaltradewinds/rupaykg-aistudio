import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { WASTE_TYPES } from "./src/constants";

async function startServer() {
  const app = express();
  app.use(express.json());

  // MUST run on port 3000 in this environment
  const PORT = 3000; 
  const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/rupaykg";
  const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || "super_internal_token";

  // Ensure public.pem and private.pem exist for RS256
  if (!fs.existsSync("./private.pem") || !fs.existsSync("./public.pem")) {
    console.log("Generating RSA Keypair for RS256...");
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    fs.writeFileSync("./public.pem", publicKey);
    fs.writeFileSync("./private.pem", privateKey);
  }
  
  const publicKey = fs.readFileSync("./public.pem", "utf8");
  const privateKey = fs.readFileSync("./private.pem", "utf8");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err: any) {
    console.log("MongoDB connection skipped or failed:", err.message);
    console.log("Using in-memory fallback for demo purposes.");
  }

  // --- IN-MEMORY FALLBACK DB ---
  const users: any[] = [];
  const records: any[] = [];
  const logs: any[] = [];

  // ---------------- AUTH MIDDLEWARE ----------------
  function auth(roles: string[] = []) {
    return (req: any, res: any, next: any) => {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });

      try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any;
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        req.user = decoded;
        next();
      } catch {
        return res.status(401).json({ error: "Invalid Token" });
      }
    };
  }

  // ---------------- AUTH ROUTES ----------------
  app.post("/api/register", (req, res) => {
    const { phone, password, role, name, district, state } = req.body;
    if (users.find(u => u.phone === phone)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { id: Date.now().toString(), phone, password, role, name, district, state, wallet_balance: 0 };
    users.push(newUser);
    res.json({ message: "Registered successfully" });
  });

  app.post("/api/login", (req, res) => {
    const { phone, password } = req.body;
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const tokenPayload = { id: user.id, role: user.role, name: user.name, district: user.district, state: user.state };
    const token = jwt.sign(tokenPayload, privateKey, { algorithm: "RS256", expiresIn: "24h" });
    res.json({ token, user: tokenPayload });
  });

  app.get("/api/me", auth(), (req: any, res) => {
    res.json({ user: req.user });
  });

  // ---------------- CITIZEN ROUTES ----------------
  app.get("/api/citizen/wallet", auth(["citizen", "fpo"]), (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    res.json({ wallet_balance: user?.wallet_balance || 0 });
  });

  app.post("/api/citizen/upload", auth(["citizen", "fpo"]), (req: any, res) => {
    const { weight_kg, waste_type, village, geo_lat, geo_long } = req.body;
    
    const wasteConfig = WASTE_TYPES.find(w => w.type === waste_type) || { value: 5, carbon: 0.5 };
    const total_value = weight_kg * (wasteConfig.value + (wasteConfig.carbon * 10));
    const carbon_reduction_kg = weight_kg * wasteConfig.carbon;
    
    const record = {
      id: "REC" + Date.now(),
      citizen_id: req.user.id,
      weight_kg,
      waste_type,
      village,
      geo_lat,
      geo_long,
      status: "pending_pickup",
      total_value,
      carbon_reduction_kg,
      timestamp: new Date().toISOString()
    };
    records.push(record);
    
    const user = users.find(u => u.id === req.user.id);
    if (user) user.wallet_balance += total_value;

    logs.push({ 
      id: Date.now(), 
      event: "BIOMASS_UPLOADED", 
      details: `Record ${record.id} uploaded by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    
    res.json({ message: `Success! Earned ₹${total_value.toFixed(2)}`, wallet_balance: user?.wallet_balance });
  });

  // ---------------- AGGREGATOR & PROCESSOR ROUTES ----------------
  app.get("/api/aggregator/available", auth(["aggregator"]), (req: any, res) => {
    const available = records.filter(r => r.status === "pending_pickup");
    res.json(available);
  });

  app.post("/api/aggregator/pickup", auth(["aggregator"]), (req: any, res) => {
    const { record_id } = req.body;
    const record = records.find(r => r.id === record_id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    if (record.status !== "pending_pickup") return res.status(400).json({ error: "Record not available for pickup" });
    
    record.status = "in_transit";
    record.aggregator_id = req.user.id;
    logs.push({ 
      id: Date.now(), 
      event: "BIOMASS_PICKUP", 
      details: `Record ${record.id} picked up by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    res.json({ message: "Pickup confirmed" });
  });

  app.get("/api/processor/available", auth(["processor"]), (req: any, res) => {
    const available = records.filter(r => r.status === "in_transit");
    res.json(available);
  });

  app.post("/api/processor/receipt", auth(["processor"]), (req: any, res) => {
    const { record_id } = req.body;
    const record = records.find(r => r.id === record_id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    if (record.status !== "in_transit") return res.status(400).json({ error: "Record not in transit" });
    
    record.status = "processed";
    record.processor_id = req.user.id;
    logs.push({ 
      id: Date.now(), 
      event: "BIOMASS_PROCESSED", 
      details: `Record ${record.id} processed by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    res.json({ message: "Processing confirmed" });
  });

  // ---------------- COMMON ROUTES ----------------
  app.get("/api/history", auth(), (req: any, res) => {
    let userRecords = records;
    if (req.user.role === "citizen" || req.user.role === "fpo") {
      userRecords = records.filter(r => r.citizen_id === req.user.id);
    } else if (req.user.role === "aggregator") {
      userRecords = records.filter(r => r.aggregator_id === req.user.id || r.status === "pending_pickup");
    } else if (req.user.role === "processor") {
      userRecords = records.filter(r => r.processor_id === req.user.id || r.status === "in_transit");
    }
    res.json(userRecords);
  });

  // ---------------- ADMIN ROUTES ----------------
  app.get("/api/admin/dashboard", auth(["state_admin", "municipal_admin", "super_admin", "regulator", "csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    const totalUsers = users.length;
    const totalRecords = records.length;
    const totalWallet = users.reduce((sum, u) => sum + (u.wallet_balance || 0), 0);
    const totalWeight = records.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    const totalCarbon = totalWeight * 0.5; // Dummy calculation

    res.json({
      total_users: totalUsers,
      total_biomass_records: totalRecords,
      total_wallet_disbursed: totalWallet,
      total_carbon_reduction_kg: totalCarbon,
      total_weight_kg: totalWeight
    });
  });

  app.get("/api/audit-logs", auth(["state_admin", "municipal_admin", "super_admin", "regulator", "csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    res.json(logs.slice(-50).reverse());
  });

  // ---------------- STATUS & INTERNAL ----------------
  app.get("/api/status", (req, res) => {
    res.json({ service: "RUPAYKG", issuer: "ALLIANCEVENTURES", auth: "RS256", status: "Active" });
  });

  app.get("/api/carbon", auth(["admin","investor"]), (req: any, res: any) => {
    res.json({ message: "Carbon Credit Secure Data", user: req.user });
  });

  app.get("/internal/metrics", async (req, res) => {
    const token = req.headers["x-service-token"];
    if (token !== INTERNAL_TOKEN) return res.status(403).json({ error: "Forbidden" });
    res.json({ wasteProcessedMT: 1320, carbonCreditsIssued: 56000, totalRevenue: 14000000 });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("RUPAYKG running on port " + PORT);
  });
}

startServer();
