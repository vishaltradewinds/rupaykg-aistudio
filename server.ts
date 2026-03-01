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
  const MONGO_URI = process.env.MONGO_URI;
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

  let dbStatus = "disconnected";
  let dbError = "";

  async function connectDB() {
    if (MONGO_URI) {
      try {
        dbStatus = "connecting";
        await mongoose.connect(MONGO_URI);
        dbStatus = "connected";
        dbError = "";
        console.log("Connected to MongoDB");
      } catch (err: any) {
        dbStatus = "failed";
        dbError = err.message;
        console.log("MongoDB connection failed:", err.message);
      }
    } else {
      dbStatus = "no_uri";
      console.log("No MONGO_URI provided. Using in-memory fallback for demo purposes.");
    }
  }

  await connectDB();

  app.get("/api/db-status", (req, res) => {
    res.json({ status: dbStatus, error: dbError });
  });

  app.post("/api/db-retry", async (req, res) => {
    await connectDB();
    res.json({ status: dbStatus, error: dbError });
  });

  // --- IN-MEMORY FALLBACK DB ---
  const users: any[] = [
    { id: "demo_citizen", phone: "9000000001", password: "password", role: "citizen", name: "Ramesh Kumar", district: "Pune", state: "Maharashtra", wallet_balance: 1250.50 },
    { id: "demo_aggregator", phone: "9000000002", password: "password", role: "aggregator", name: "Logistics Pro", organization_name: "Green Logistics Ltd", district: "Pune", state: "Maharashtra", wallet_balance: 5400.00 },
    { id: "demo_processor", phone: "9000000003", password: "password", role: "processor", name: "Recycle Master", organization_name: "EcoProcessors Inc", district: "Pune", state: "Maharashtra", wallet_balance: 12000.00 },
    { id: "demo_municipal", phone: "9000000004", password: "password", role: "municipal_admin", name: "Municipal Officer", organization_name: "Pune Municipal Corp", district: "Pune", state: "Maharashtra", wallet_balance: 0 },
    { id: "demo_state", phone: "9000000005", password: "password", role: "state_admin", name: "State Secretary", organization_name: "Maharashtra Environment Dept", district: "Mumbai", state: "Maharashtra", wallet_balance: 0 },
    { id: "demo_buyer", phone: "9000000006", password: "password", role: "carbon_buyer", name: "ESG Manager", organization_name: "Global Corp ESG", district: "Delhi", state: "Delhi", wallet_balance: 50000.00 },
    { id: "demo_regulator", phone: "9000000007", password: "password", role: "regulator", name: "National Auditor", organization_name: "Central Pollution Control Board", district: "Delhi", state: "Delhi", wallet_balance: 0 }
  ];
  const records: any[] = [
    { id: "REC1", citizen_id: "demo_citizen", weight_kg: 50, waste_type: "Agricultural", village: "Ambegaon", status: "processed", carbon_reduction_kg: 25, total_value: 750, context: "rural", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), mrv_status: "verified", mrv_verified_by: "demo_regulator", mrv_verified_at: new Date(Date.now() - 86400000).toISOString(), acreage: 0.2, risk_score: 0.1 },
    { id: "REC2", citizen_id: "demo_citizen", weight_kg: 30, waste_type: "Municipal", village: "Ward 12", status: "processed", carbon_reduction_kg: 15, total_value: 450, context: "urban", timestamp: new Date(Date.now() - 86400000).toISOString(), mrv_status: "verified", mrv_verified_by: "demo_regulator", mrv_verified_at: new Date(Date.now() - 43200000).toISOString(), acreage: 0.1, risk_score: 0.2 }
  ];
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
    const { phone, password, role, name, district, state, organization_name } = req.body;
    if (users.find(u => u.phone === phone)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = { 
      id: Date.now().toString(), 
      phone, 
      password, 
      role, 
      name, 
      district, 
      state, 
      organization_name: organization_name || null,
      wallet_balance: 0 
    };
    users.push(newUser);
    res.json({ message: "Registered successfully" });
  });

  app.post("/api/login", (req, res) => {
    const { phone, password } = req.body;
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const tokenPayload = { 
      id: user.id, 
      role: user.role, 
      name: user.name, 
      district: user.district, 
      state: user.state,
      organization_name: user.organization_name
    };
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
    const { weight_kg, waste_type, village, geo_lat, geo_long, image_url, context } = req.body;
    
    const wasteConfig = WASTE_TYPES.find(w => w.type === waste_type) || { value: 5, carbon: 0.5 };
    const base_value = weight_kg * wasteConfig.value;
    const carbon_reduction_kg = weight_kg * wasteConfig.carbon;
    const potential_carbon_value = carbon_reduction_kg * 10;
    const total_value = base_value + potential_carbon_value;
    
    const record = {
      id: "REC" + Date.now(),
      citizen_id: req.user.id,
      weight_kg,
      waste_type,
      village,
      geo_lat,
      geo_long,
      image_url,
      context: context || "rural", // Default to rural if not provided
      status: "pending_pickup",
      mrv_status: "pending", // MRV Status: pending, verified, rejected
      base_value,
      potential_carbon_value,
      total_value,
      carbon_reduction_kg,
      timestamp: new Date().toISOString()
    };
    records.push(record);
    
    const user = users.find(u => u.id === req.user.id);
    if (user) user.wallet_balance += base_value; // Only base value is credited initially

    logs.push({ 
      id: Date.now(), 
      event: "WASTE_UPLOADED", 
      details: `Record ${record.id} uploaded by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    
    res.json({ message: `Success! Base value ₹${base_value.toFixed(2)} credited. Carbon value pending MRV.`, wallet_balance: user?.wallet_balance });
  });

  // ---------------- MRV ROUTES ----------------
  app.get("/api/mrv/pending", auth(["regulator", "state_admin", "super_admin"]), (req: any, res) => {
    const pendingMRV = records.filter(r => r.mrv_status === "pending" && r.status === "processed");
    res.json(pendingMRV);
  });

  app.get("/api/mrv/history", auth(["regulator", "state_admin", "super_admin"]), (req: any, res) => {
    const historyMRV = records
      .filter(r => r.mrv_status === "verified" || r.mrv_status === "rejected")
      .map(r => {
        const verifier = users.find(u => u.id === r.mrv_verified_by);
        return {
          ...r,
          mrv_verified_by_name: verifier ? verifier.name : "Unknown",
          mrv_verified_by_role: verifier ? verifier.role : "Unknown"
        };
      })
      .sort((a, b) => new Date(b.mrv_verified_at || 0).getTime() - new Date(a.mrv_verified_at || 0).getTime());
    res.json(historyMRV);
  });

  app.post("/api/mrv/verify", auth(["regulator", "state_admin", "super_admin"]), (req: any, res) => {
    const { record_id, status } = req.body; // status: 'verified' or 'rejected'
    const record = records.find(r => r.id === record_id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    if (record.mrv_status !== "pending") return res.status(400).json({ error: "MRV already processed" });
    if (record.status !== "processed") return res.status(400).json({ error: "Waste must be processed before MRV verification" });
    
    record.mrv_status = status;
    record.mrv_verified_by = req.user.id;
    record.mrv_verified_at = new Date().toISOString();
    
    if (status === "verified") {
      const user = users.find(u => u.id === record.citizen_id);
      if (user) {
        user.wallet_balance += record.potential_carbon_value;
      }
      logs.push({ 
        id: Date.now(), 
        event: "MRV_VERIFIED", 
        details: `Carbon credits issued for ${record.id} by ${req.user.id}`, 
        timestamp: new Date().toISOString() 
      });
    } else {
      logs.push({ 
        id: Date.now(), 
        event: "MRV_REJECTED", 
        details: `MRV rejected for ${record.id} by ${req.user.id}`, 
        timestamp: new Date().toISOString() 
      });
    }
    
    res.json({ message: `MRV ${status} successfully` });
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
    const { context } = req.query;
    let userRecords = records;
    
    if (context && context !== 'all') {
      userRecords = userRecords.filter(r => r.context === context);
    }

    if (req.user.role === "citizen" || req.user.role === "fpo") {
      userRecords = userRecords.filter(r => r.citizen_id === req.user.id);
    } else if (req.user.role === "aggregator") {
      userRecords = userRecords.filter(r => r.aggregator_id === req.user.id || r.status === "pending_pickup");
    } else if (req.user.role === "processor") {
      userRecords = userRecords.filter(r => r.processor_id === req.user.id || r.status === "in_transit");
    }

    // Hide MRV status from non-citizens and non-admins
    if (!["citizen", "fpo", "regulator", "state_admin", "super_admin"].includes(req.user.role)) {
      userRecords = userRecords.map(r => {
        const { mrv_status, mrv_verified_by, mrv_verified_by_name, mrv_verified_by_role, mrv_verified_at, ...rest } = r;
        return rest;
      });
    } else {
      // Populate verifier details for authorized roles
      userRecords = userRecords.map(r => {
        if (r.mrv_verified_by) {
          const verifier = users.find(u => u.id === r.mrv_verified_by);
          return {
            ...r,
            mrv_verified_by_name: verifier ? verifier.name : "Unknown",
            mrv_verified_by_role: verifier ? verifier.role : "Unknown"
          };
        }
        return r;
      });
    }

    res.json(userRecords);
  });

  app.post("/api/admin/seed", auth(["super_admin", "state_admin", "municipal_admin"]), (req, res) => {
    // Add some random records to make dashboards look good
    const contexts = ["urban", "rural"];
    const statuses = ["pending_pickup", "in_transit", "processed"];
    const wasteTypes = WASTE_TYPES.map(w => w.type);
    
    for (let i = 0; i < 20; i++) {
      const context = contexts[Math.floor(Math.random() * contexts.length)];
      const waste_type = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
      const wasteConfig = WASTE_TYPES.find(w => w.type === waste_type) || { value: 5, carbon: 0.5 };
      const weight_kg = Math.floor(Math.random() * 100) + 10;
      const carbon_reduction_kg = weight_kg * wasteConfig.carbon;
      const total_value = (weight_kg * wasteConfig.value) + (carbon_reduction_kg * 10);
      
      const acreage = Math.random() * 0.5 + 0.05;
      const expected_kg = acreage * 2500; // 2.5 tonnes per acre
      const risk_score = Math.abs(expected_kg - weight_kg) / expected_kg;

      const isVerified = Math.random() > 0.3;
      records.push({
        id: "SEED" + i + Date.now(),
        citizen_id: "demo_citizen",
        aggregator_id: "demo_aggregator",
        processor_id: "demo_processor",
        weight_kg,
        waste_type,
        village: context === "urban" ? "Ward " + (Math.floor(Math.random() * 20) + 1) : "Village " + String.fromCharCode(65 + Math.floor(Math.random() * 10)),
        geo_lat: 18.5204 + (Math.random() * 0.1),
        geo_long: 73.8567 + (Math.random() * 0.1),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
        carbon_reduction_kg,
        total_value,
        context,
        acreage,
        risk_score,
        mrv_status: isVerified ? "verified" : "pending",
        ...(isVerified && {
          mrv_verified_by: "demo_regulator",
          mrv_verified_at: new Date(Date.now() - Math.floor(Math.random() * 500000000)).toISOString()
        })
      });
    }
    
    res.json({ message: "Seeded 20 records" });
  });

  // ---------------- PARTNER ROUTES ----------------
  app.get("/api/partner/wallet", auth(["csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    res.json({ wallet_balance: user?.wallet_balance || 0 });
  });

  app.post("/api/partner/fund", auth(["csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    const { amount } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.wallet_balance = (user.wallet_balance || 0) + amount;
    
    logs.push({ 
      id: Date.now(), 
      event: "FUNDS_ADDED", 
      details: `₹${amount} added to wallet by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    
    res.json({ message: `Successfully added ₹${amount} to wallet`, wallet_balance: user.wallet_balance });
  });

  app.get("/api/partner/available-credits", auth(["csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    // In a real system, these would be aggregated from verified MRV records
    const availableCredits = records
      .filter(r => r.mrv_status === "verified" && !r.purchased_by)
      .map(r => ({
        id: r.id,
        carbon_reduction_kg: r.carbon_reduction_kg,
        price: r.potential_carbon_value,
        waste_type: r.waste_type,
        village: r.village
      }));
    res.json(availableCredits);
  });

  app.post("/api/partner/purchase-credits", auth(["csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    const { record_ids } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recordsToPurchase = records.filter(r => record_ids.includes(r.id) && r.mrv_status === "verified" && !r.purchased_by);
    const totalCost = recordsToPurchase.reduce((sum, r) => sum + (r.potential_carbon_value || 0), 0);

    if (user.wallet_balance < totalCost) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    user.wallet_balance -= totalCost;
    recordsToPurchase.forEach(r => {
      r.purchased_by = user.id;
    });

    logs.push({ 
      id: Date.now(), 
      event: "CREDITS_PURCHASED", 
      details: `${recordsToPurchase.length} credits purchased by ${req.user.id} for ₹${totalCost}`, 
      timestamp: new Date().toISOString() 
    });

    res.json({ message: `Successfully purchased ${recordsToPurchase.length} credits`, wallet_balance: user.wallet_balance });
  });

  // ---------------- ADMIN ROUTES ----------------
  // ================================
  // SERIES A KPI ENDPOINT
  // ================================
  app.get("/api/admin/kpi", auth(["super_admin", "state_admin", "regulator"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records;
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    const total_waste = filteredRecords.length;
    const processed = filteredRecords.filter(r => r.status === "processed").length;
    const total_users = users.length;
    
    // Calculate total wallet disbursed (sum of all potential_carbon_value of verified records)
    const total_wallet = filteredRecords.filter(r => r.mrv_status === "verified").reduce((sum, r) => sum + (r.potential_carbon_value || 0), 0);

    res.json({
        total_waste_events: total_waste,
        processed_events: processed,
        total_users: total_users,
        wallet_disbursed: total_wallet
    });
  });

  // ================================
  // WARD LEVEL GOVERNMENT ANALYTICS
  // ================================
  app.get("/api/municipal/ward-analytics", auth(["municipal_admin", "state_admin", "super_admin"]), (req: any, res) => {
    const { context } = req.query;
    const wardData: Record<string, { _id: string, total_weight: number, count: number }> = {};
    
    let filteredRecords = records;
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    filteredRecords.forEach(r => {
      const ward = r.village || "Unknown";
      if (!wardData[ward]) {
        wardData[ward] = { _id: ward, total_weight: 0, count: 0 };
      }
      wardData[ward].total_weight += (r.weight_kg || 0);
      wardData[ward].count += 1;
    });

    res.json({ ward_data: Object.values(wardData) });
  });

  // ================================
  // FRAUD HEATMAP DATA
  // ================================
  app.get("/api/admin/fraud-map", auth(["super_admin", "state_admin", "regulator"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records.filter(r => r.mrv_status === "rejected" || r.status === "flagged");
    
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    res.json({ flagged_events: filteredRecords });
  });

  // ================================
  // CARBON POOL STATUS
  // ================================
  app.get("/api/carbon/pool", auth(["carbon_buyer", "regulator", "super_admin", "csr_partner", "epr_partner"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records.filter(r => r.mrv_status === "verified");
    
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    const total_minted = filteredRecords.reduce((sum, r) => sum + (r.carbon_reduction_kg || 0), 0);
    res.json({ total_carbon_units_minted: total_minted });
  });

  app.get("/api/admin/dashboard", auth(["state_admin", "municipal_admin", "super_admin", "regulator", "csr_partner", "epr_partner", "carbon_buyer"]), (req: any, res) => {
    const { role, context } = req.query;
    
    let filteredUsers = users;
    if (role && role !== 'all') {
      if (role === 'citizen' || role === 'fpo') {
        filteredUsers = users.filter(u => u.role === 'citizen' || u.role === 'fpo');
      } else {
        filteredUsers = users.filter(u => u.role === role);
      }
    }
    
    let filteredRecords = records;
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    if (role && role !== 'all') {
      if (role === 'citizen' || role === 'fpo') {
        filteredRecords = filteredRecords.filter(r => filteredUsers.some(u => u.id === r.citizen_id));
      } else if (role === 'aggregator') {
        filteredRecords = filteredRecords.filter(r => filteredUsers.some(u => u.id === r.aggregator_id));
      } else if (role === 'processor') {
        filteredRecords = filteredRecords.filter(r => filteredUsers.some(u => u.id === r.processor_id));
      } else if (['csr_partner', 'epr_partner', 'carbon_buyer'].includes(role)) {
        filteredRecords = filteredRecords.filter(r => filteredUsers.some(u => u.id === r.purchased_by));
      } else {
        filteredRecords = [];
      }
    }

    const totalUsers = filteredUsers.length;
    const totalRecords = filteredRecords.length;
    const totalWallet = filteredUsers.reduce((sum, u) => sum + (u.wallet_balance || 0), 0);
    const totalWeight = filteredRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
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
