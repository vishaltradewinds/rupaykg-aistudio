import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";
import { WASTE_TYPES as INITIAL_WASTE_TYPES } from "./src/constants";
import { SatelliteVerificationService } from "./src/services/satelliteService";
import { CCCRegistryService } from "./src/services/cccRegistryService";
import { generateCarbonEvent } from "./src/services/carbonEngine";

let dynamicWasteTypes = [...INITIAL_WASTE_TYPES];
let paymentConfig = {
  ccc_price_per_kg: 10,
  logistics_margin_percent: 15
};

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

  // Start DB connection in background
  connectDB().catch(err => console.error("Background DB connection failed:", err));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ---------------- PUBLIC API ----------------
  app.get("/api/public/impact", (req, res) => {
    try {
      res.setHeader("X-Server-Status", "alive");
      const verifiedRecords = records.filter(r => r.mrv_status === "verified");
      
      const total_weight_kg = verifiedRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
      const total_ccc_amount_kg = verifiedRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);
      const total_value = verifiedRecords.reduce((sum, r) => sum + (r.total_value || 0), 0);
      const active_nodes = users.length;

      // Group by month for chart
      const monthlyData: Record<string, number> = {};
      verifiedRecords.forEach(r => {
        const date = new Date(r.timestamp);
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + (r.weight_kg || 0);
      });

      let chartData = Object.keys(monthlyData).map(month => ({
        month,
        weight: monthlyData[month]
      }));

      if (chartData.length === 0 && users.length === 0) {
        chartData = [
          { month: 'Jan', weight: 400 },
          { month: 'Feb', weight: 700 },
          { month: 'Mar', weight: 600 },
          { month: 'Apr', weight: 1200 },
          { month: 'May', weight: 1500 },
          { month: 'Jun', weight: 2100 },
          { month: 'Jul', weight: 2800 },
        ];
      }

      // Network Topology (Users grouped by state)
      const stateCounts: Record<string, number> = {};
      users.forEach(u => {
        if (u.state) {
          stateCounts[u.state] = (stateCounts[u.state] || 0) + 1;
        }
      });
      
      const colors = ['emerald', 'blue', 'purple', 'cyan', 'amber', 'rose'];
      let networkTopology = Object.keys(stateCounts)
        .map((state, index) => ({
          name: state + ' Cluster',
          nodes: stateCounts[state],
          load: Math.min(100, 40 + (stateCounts[state] * 5)) + '%',
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.nodes - a.nodes)
        .slice(0, 4);

      if (networkTopology.length === 0 && users.length === 0) {
        networkTopology = [
          { name: 'Maharashtra Cluster', nodes: 412, load: '84%', color: 'emerald' },
          { name: 'Punjab Agricultural Rail', nodes: 284, load: '92%', color: 'blue' },
          { name: 'Karnataka Bio-Hub', nodes: 156, load: '67%', color: 'purple' },
          { name: 'Gujarat Municipal Rail', nodes: 390, load: '78%', color: 'cyan' }
        ];
      }

      // Rail Distribution (Records grouped by context or user role)
      const roleCounts: Record<string, number> = {};
      users.forEach(u => {
        // Filter out administrative roles from the distribution chart
        if (!['super_admin', 'state_admin', 'municipal_admin', 'regulator'].includes(u.role)) {
          roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
        }
      });

      let railDistribution = Object.keys(roleCounts).map(role => ({
        name: role.replace('_', ' ').toUpperCase(),
        value: roleCounts[role]
      }));

      if (railDistribution.length === 0) {
        railDistribution = [
          { name: 'RECYCLER', value: 35 },
          { name: 'CSR', value: 20 },
          { name: 'MUNICIPAL', value: 15 },
          { name: 'CCC', value: 20 },
          { name: 'EPR', value: 10 }
        ];
      }

      res.json({
        total_weight_kg,
        total_ccc_amount_kg,
        total_value,
        active_nodes,
        chartData,
        networkTopology,
        railDistribution
      });
    } catch (err) {
      console.error("Public impact API error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/db-status", auth(["super_admin", "state_admin"]), (req, res) => {
    res.json({ status: dbStatus, error: dbError });
  });

  app.post("/api/db-retry", auth(["super_admin"]), async (req, res) => {
    await connectDB();
    res.json({ status: dbStatus, error: dbError });
  });

  // ---------------- MONGOOSE SCHEMAS (PRODUCTION) ----------------
  const userSchema = new mongoose.Schema({
    id: String,
    phone: { type: String, unique: true },
    password: { type: String },
    role: String,
    name: String,
    district: String,
    state: String,
    organization_name: String,
    wallet_balance: { type: Number, default: 0 }
  });
  const User = mongoose.model('User', userSchema);

  const pilotRecordSchema = new mongoose.Schema({
    id: String,
    weight: Number,
    wasteType: String,
    location: String,
    photoUrl: String,
    collectorId: String,
    timestamp: String,
    estimatedCCC: Number,
    isValidated: Boolean,
    validationScore: Number,
    validationExplanation: String,
    status: String,
    source: String
  });
  const PilotRecord = mongoose.model('PilotRecord', pilotRecordSchema);

  const pilotOnboardingSchema = new mongoose.Schema({
    id: String,
    name: String,
    role: String,
    phone: String,
    location: String,
    timestamp: String,
    status: String
  });
  const PilotOnboarding = mongoose.model('PilotOnboarding', pilotOnboardingSchema);

  // --- IN-MEMORY FALLBACK DB ---
  const users: any[] = [
    { id: "admin_1", phone: "9999999999", password: "admin_password", role: "super_admin", name: "System Administrator", organization_name: "Alliance Ventures", district: "Delhi", state: "Delhi", wallet_balance: 0 }
  ];
  const records: any[] = [];
  const logs: any[] = [];
  const farmers: any[] = [];
  const notifications: any[] = [];
  const blockchain: any[] = [];
  const pilotRecords: any[] = [];
  const pilotOnboarding: any[] = [];

  // Carbon Event Memory Stores
  const carbonEvents: any[] = [];
  const carbonCalculations: any[] = [];
  const methaneEvents: any[] = [];
  const mrvEvidence: any[] = [];
  const wasteComposition: any[] = [];
  const biomassProfiles: any[] = [];
  const carbonProjects: any[] = [];
  const carbonAuditLogs: any[] = [];
  const carbonRegistryExports: any[] = [];
  const additionalityAnalysis: any[] = [];

  // ---------------- BLOCKCHAIN LOGIC ----------------
  function calculateHash(index: number, timestamp: string, data: any, previousHash: string) {
    return crypto
      .createHash("sha256")
      .update(index + timestamp + JSON.stringify(data) + previousHash)
      .digest("hex");
  }

  function mintBlock(data: any) {
    const previousBlock = blockchain[blockchain.length - 1];
    const index = blockchain.length;
    const timestamp = new Date().toISOString();
    const previousHash = previousBlock ? previousBlock.hash : "0";
    const hash = calculateHash(index, timestamp, data, previousHash);
    
    const newBlock = {
      index,
      timestamp,
      data,
      previousHash,
      hash
    };
    
    blockchain.push(newBlock);
    
    // Log to audit logs
    logs.push({
      timestamp: new Date().toISOString(),
      action: "BLOCKCHAIN_MINT",
      user_id: "SYSTEM",
      details: {
        block_index: index,
        block_hash: hash,
        transaction_type: data.type || "System"
      }
    });

    return newBlock;
  }

  // Initialize Genesis Block
  mintBlock({ message: "Genesis Block - RupayKG CCC Ledger Initialized" });

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
  const PUBLIC_ROLES = ["citizen", "fpo", "csr_partner", "epr_partner", "ccc_buyer"];
  const ADMIN_ROLES = ["super_admin", "state_admin", "municipal_admin", "regulator"];

  app.post("/api/register", async (req, res) => {
    const { phone, password, role, name, district, state, organization_name } = req.body;
    
    // Security check: prevent self-registration of admin roles
    if (ADMIN_ROLES.includes(role)) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(403).json({ error: "Administrative roles must be created by an existing administrator" });
      }
      
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] }) as any;
        if (decoded.role !== "super_admin" && decoded.role !== "state_admin") {
          return res.status(403).json({ error: "Forbidden: Only super admins or state admins can create administrative accounts" });
        }
      } catch (err) {
        return res.status(401).json({ error: "Invalid or expired administrator token" });
      }
    }

    if (!PUBLIC_ROLES.includes(role) && !ADMIN_ROLES.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    if (dbStatus === "connected") {
      const existingUser = await User.findOne({ phone });
      if (existingUser) return res.status(400).json({ error: "User already exists" });
    } else {
      if (users.find(u => u.phone === phone)) return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { 
      id: Date.now().toString(), 
      phone, 
      password: hashedPassword, 
      role, 
      name, 
      district, 
      state, 
      organization_name: organization_name || null,
      wallet_balance: 0 
    };

    if (dbStatus === "connected") {
      await User.create(newUser);
    } else {
      users.push(newUser);
    }

    res.json({ message: "Registered successfully", role });
  });

  app.post("/api/login", async (req, res) => {
    const { phone, password } = req.body;
    
    let user;
    if (dbStatus === "connected") {
      user = await User.findOne({ phone });
    } else {
      user = users.find(u => u.phone === phone);
    }
    
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Handle legacy plain text passwords for mock data, and bcrypt for new users
    let isMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Fallback for legacy plain text passwords in mock data
      isMatch = user.password === password;
    }
    
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

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

  app.post("/api/auth/reset-password", async (req, res) => {
    const { phone, new_password } = req.body;
    const user = users.find(u => u.phone === phone);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(new_password, salt);
    res.json({ message: "Password reset successfully" });
  });

  app.get("/api/me", auth(), (req: any, res) => {
    res.json({ user: req.user });
  });

  // ---------------- FARMER ROUTES ----------------
  app.post("/api/farmer/create", auth(["aggregator"]), (req: any, res) => {
    const { name, mobile, land_area, crop_type, latitude, longitude } = req.body;
    
    const farmer_id = "FARMER_" + Date.now();
    const newFarmer = {
      farmer_id,
      name,
      mobile,
      land_area,
      crop_type,
      geo_location: {
        lat: latitude,
        lng: longitude
      },
      created_at: new Date().toISOString(),
      created_by: req.user.id
    };
    
    farmers.push(newFarmer);
    
    // Also log this action
    logs.push({
      id: Date.now(),
      event: "FARMER_CREATED",
      actor: req.user.name,
      details: `Farmer ${name} registered by aggregator`,
      timestamp: new Date().toISOString()
    });

    res.json({ farmer_id, message: "Farmer record created successfully" });
  });

  app.get("/api/farmer/:id", auth(["aggregator", "super_admin", "state_admin", "municipal_admin"]), (req: any, res) => {
    const farmer = farmers.find(f => f.farmer_id === req.params.id);
    if (!farmer) return res.status(404).json({ error: "Farmer not found" });
    res.json(farmer);
  });

  app.get("/api/farmer/list", auth(["aggregator", "super_admin", "state_admin", "municipal_admin"]), (req: any, res) => {
    res.json(farmers);
  });

  // ---------------- CITIZEN ROUTES ----------------
  app.get("/api/citizen/wallet", auth(["citizen", "fpo"]), (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    res.json({ wallet_balance: user?.wallet_balance || 0 });
  });

  app.get("/api/citizen/profile", auth(["citizen", "fpo"]), (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.post("/api/profile/update", auth(), (req: any, res) => {
    const { name, district, state, organization_name } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    if (name !== undefined) user.name = name;
    if (district !== undefined) user.district = district;
    if (state !== undefined) user.state = state;
    if (organization_name !== undefined) user.organization_name = organization_name;

    res.json({ 
      message: "Profile updated successfully", 
      user: { 
        id: user.id, 
        name: user.name, 
        role: user.role,
        district: user.district,
        state: user.state,
        organization_name: user.organization_name
      } 
    });
  });

  app.post("/api/biomass/estimate", auth(["citizen", "fpo", "aggregator"]), (req: any, res) => {
    const { crop_type, hectares } = req.body;
    const factors: Record<string, number> = {
      'Rice': 2.5,
      'Wheat': 1.8,
      'Maize': 2.0
    };
    const factor = factors[crop_type] || 1.0;
    const estimated_tons = hectares * factor;
    res.json({ crop_type, hectares, estimated_tons, estimated_kg: estimated_tons * 1000 });
  });

  app.post("/api/citizen/upload", auth(["citizen", "fpo"]), async (req: any, res) => {
    const { weight_kg, waste_type, village, geo_lat, geo_long, image_url, context, acreage, double_counting_declaration, ai_risk_score, ai_verification_details } = req.body;
    
    const wasteConfig = dynamicWasteTypes.find(w => w.type === waste_type) || { value: 5, ccc_factor: 0.5 };
    const base_value = weight_kg * wasteConfig.value;
    const ccc_amount_kg = weight_kg * wasteConfig.ccc_factor;
    const potential_ccc_value = ccc_amount_kg * paymentConfig.ccc_price_per_kg;
    const total_value = base_value + potential_ccc_value;
    
    // AI Risk Score from Frontend
    let risk_score = ai_risk_score !== undefined ? ai_risk_score : 0;
    let verification_details = ai_verification_details || "AI Verification Skipped";
    
    if (!image_url) {
      risk_score += 0.2;
      verification_details = "No image provided for AI verification.";
    }
    
    // 1. Geolocation accuracy (mock: if missing, high risk)
    if (!geo_lat || !geo_long) {
      risk_score += 0.3;
    } else {
      // Mock: check if coordinates are within expected bounds (e.g., India)
      if (geo_lat < 8 || geo_lat > 37 || geo_long < 68 || geo_long > 97) {
        risk_score += 0.2;
      }
    }

    // Cap at 1.0
    risk_score = Math.min(risk_score, 1.0);
    
    const satellite_verification = await SatelliteVerificationService.verifyActivity(geo_lat, geo_long, waste_type);
    
    const record = {
      id: "REC" + Date.now(),
      citizen_id: req.user.id,
      weight_kg,
      waste_type,
      village,
      geo_lat,
      geo_long,
      image_url,
      acreage: acreage || 0,
      double_counting_declaration: double_counting_declaration || false,
      risk_score,
      ai_verification_details: verification_details,
      satellite_verification,
      context: context || "rural", // Default to rural if not provided
      status: "pending_pickup",
      mrv_status: "pending", // MRV Status: pending, verified, rejected
      base_value,
      potential_ccc_value,
      total_value,
      ccc_amount_kg,
      timestamp: new Date().toISOString()
    };
    records.push(record);
    
    try {
      // Core Integration Principle: ENRICH existing workflows with carbon intelligence
      const carbonEvent = generateCarbonEvent(record, wasteConfig);
      carbonEvents.push(carbonEvent);
      logs.push({ 
        id: Date.now(), 
        event: "WASTE_UPLOADED", 
        details: `Record ${record.id} uploaded by ${req.user.id} - Carbon Event ${carbonEvent.id}`, 
        timestamp: new Date().toISOString() 
      });
      res.json({ message: `Success! Base value ₹${base_value.toFixed(2)} credited. Carbon Engine calculated ${carbonEvent.net_carbon_reduction_kg_co2e.toFixed(1)}kg CO2e.`, wallet_balance: user?.wallet_balance });
    } catch (carbonErr) {
      console.error("Carbon Engine enriched upload failed, continuing with base workflow:", carbonErr);
      logs.push({ 
        id: Date.now(), 
        event: "WASTE_UPLOADED", 
        details: `Record ${record.id} uploaded by ${req.user.id}`, 
        timestamp: new Date().toISOString() 
      });
      res.json({ message: `Success! Base value ₹${base_value.toFixed(2)} credited. CCC value pending MRV.`, wallet_balance: user?.wallet_balance });
    }
  });

  app.post("/api/satellite/verify", auth(["regulator", "super_admin"]), async (req: any, res) => {
    const { lat, lng, activity_type } = req.body;
    try {
      const result = await SatelliteVerificationService.verifyActivity(lat, lng, activity_type);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Satellite verification failed" });
    }
  });

  app.get("/api/citizen/records", auth(["citizen", "fpo"]), (req: any, res) => {
    const userRecords = records.filter(r => r.citizen_id === req.user.id);
    res.json(userRecords);
  });

  app.get("/api/citizen/impact", auth(["citizen", "fpo"]), (req: any, res) => {
    const userRecords = records.filter(r => r.citizen_id === req.user.id);
    const total_weight = userRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    const total_ccc_amount = userRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);
    const verified_ccc_amount = userRecords.filter(r => r.mrv_status === "verified").reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);
    
    res.json({
      total_weight_kg: total_weight,
      total_ccc_amount_kg: total_ccc_amount,
      verified_ccc_amount_kg: verified_ccc_amount,
      trees_equivalent: Number((total_ccc_amount / 20).toFixed(1)), // 1 tree = 20kg CO2/year
      rank: Math.floor(Math.random() * 100) + 1
    });
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

  app.post("/api/mrv/verify", auth(["regulator", "state_admin", "super_admin"]), async (req: any, res) => {
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
        user.wallet_balance += record.potential_ccc_value;
      }

      // Register with External CCC Registry
      const registrySerialNumber = await CCCRegistryService.registerVerifiedActivity(record, req.user.id);
      record.registry_serial_number = registrySerialNumber;

      // Update Carbon Event status to verified
      const carbonEvent = carbonEvents.find(ev => ev.waste_event_id === record.id);
      if (carbonEvent) {
        carbonEvent.status = "verified";
        carbonEvent.verified_at = new Date().toISOString();
        carbonEvent.verified_by = req.user.id;
        carbonEvent.registry_serial_number = registrySerialNumber;
      }

      // Record on Blockchain
      const blockchainTx = {
        record_id: record.id,
        user_id: record.citizen_id,
        waste_type: record.waste_type,
        weight_kg: record.weight_kg,
        ccc_amount_kg: record.ccc_amount_kg,
        verified_by: req.user.id,
        registry_serial_number: registrySerialNumber,
        event_type: "CCC_MINTING"
      };
      const block = mintBlock(blockchainTx);
      record.blockchain_hash = block.hash;
      record.blockchain_index = block.index;

      logs.push({ 
        id: Date.now(), 
        event: "MRV_VERIFIED", 
        details: `CCCs issued for ${record.id} by ${req.user.id}. Registry ID: ${registrySerialNumber}. Recorded on Blockchain Block #${block.index}`, 
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

  app.post("/api/regulator/flag", auth(["regulator", "super_admin"]), (req: any, res) => {
    const { record_id, reason } = req.body;
    const record = records.find(r => r.id === record_id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    
    record.status = "flagged";
    record.flag_reason = reason;
    record.flagged_by = req.user.id;
    
    logs.push({ 
      id: Date.now(), 
      event: "RECORD_FLAGGED", 
      details: `Record ${record_id} flagged by ${req.user.id}: ${reason}`, 
      timestamp: new Date().toISOString() 
    });
    res.json({ message: "Record flagged for investigation" });
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

  app.post("/api/aggregator/assign", auth(["aggregator"]), (req: any, res) => {
    const { record_id, driver_name, vehicle_no } = req.body;
    const record = records.find(r => r.id === record_id);
    if (!record) return res.status(404).json({ error: "Record not found" });
    
    record.assigned_driver = driver_name;
    record.assigned_vehicle = vehicle_no;
    
    logs.push({ 
      id: Date.now(), 
      event: "PICKUP_ASSIGNED", 
      details: `Driver ${driver_name} assigned to record ${record_id}`, 
      timestamp: new Date().toISOString() 
    });
    res.json({ message: "Driver assigned successfully" });
  });

  app.get("/api/aggregator/fleet", auth(["aggregator"]), (req: any, res) => {
    // Dummy fleet data
    res.json({
      active_vehicles: 12,
      in_maintenance: 2,
      total_capacity_kg: 50000,
      current_load_kg: 12400,
      drivers_online: 10
    });
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

  app.post("/api/processor/report", auth(["processor"]), (req: any, res) => {
    const { output_type, quantity_kg, energy_kwh } = req.body;
    // In a real app, this would update a processing batch or inventory
    logs.push({ 
      id: Date.now(), 
      event: "PROCESSING_REPORT", 
      details: `Processor ${req.user.id} reported ${quantity_kg}kg of ${output_type}`, 
      timestamp: new Date().toISOString() 
    });
    res.json({ message: "Processing report submitted" });
  });

  app.get("/api/processor/inventory", auth(["processor"]), (req: any, res) => {
    const processedWeight = records
      .filter(r => r.processor_id === req.user.id && r.status === "processed")
      .reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    
    res.json({
      biomass_in_stock_kg: processedWeight,
      output_material_ready_kg: processedWeight * 0.85, // 15% loss in processing
      storage_utilization: "65%"
    });
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
    } else if (["csr_partner", "epr_partner", "ccc_buyer"].includes(req.user.role)) {
      userRecords = userRecords.filter(r => r.purchased_by === req.user.id);
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

  app.get("/api/notifications", auth(), (req: any, res) => {
    const userNotifications = notifications.filter(n => n.user_id === req.user.id || n.user_id === "all");
    res.json(userNotifications.slice(-20).reverse());
  });

  app.post("/api/notifications/read", auth(), (req: any, res) => {
    const { notification_id } = req.body;
    const notification = notifications.find(n => n.id === notification_id && (n.user_id === req.user.id || n.user_id === "all"));
    if (notification) {
      notification.read = true;
    }
    res.json({ success: true });
  });

  // Removed demo reset and seed routes for live production environment

  // ---------------- PARTNER ROUTES ----------------
  app.get("/api/partner/wallet", auth(["csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    const user = users.find(u => u.id === req.user.id);
    res.json({ wallet_balance: user?.wallet_balance || 0 });
  });

  app.post("/api/partner/fund", auth(["csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
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

  app.get("/api/partner/available-cccs", auth(["csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    // In a real system, these would be aggregated from verified MRV records
    const availableCCCs = records
      .filter(r => r.mrv_status === "verified" && !r.purchased_by)
      .map(r => ({
        id: r.id,
        ccc_amount_kg: r.ccc_amount_kg,
        price: r.potential_ccc_value,
        waste_type: r.waste_type,
        village: r.village,
        blockchain_hash: r.blockchain_hash
      }));
    res.json(availableCCCs);
  });

  app.post("/api/partner/purchase-cccs", auth(["csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    const { record_ids } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const recordsToPurchase = records.filter(r => record_ids.includes(r.id) && r.mrv_status === "verified" && !r.purchased_by);
    const totalCost = recordsToPurchase.reduce((sum, r) => sum + (r.potential_ccc_value || 0), 0);

    if (user.wallet_balance < totalCost) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    user.wallet_balance -= totalCost;
    recordsToPurchase.forEach(r => {
      r.purchased_by = user.id;
    });

    logs.push({ 
      id: Date.now(), 
      event: "CCCS_PURCHASED", 
      details: `${recordsToPurchase.length} CCCs purchased by ${req.user.id} for ₹${totalCost}`, 
      timestamp: new Date().toISOString() 
    });

    res.json({ message: `Successfully purchased ${recordsToPurchase.length} CCCs`, wallet_balance: user.wallet_balance });
  });

  app.get("/api/partner/purchases", auth(["csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    const purchases = records.filter(r => r.purchased_by === req.user.id);
    res.json(purchases);
  });

  // ---------------- ADMIN ROUTES ----------------
  // ================================
  // SERIES A KPI ENDPOINT
  // ================================
  app.get("/api/admin/kpi", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records;
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    const total_waste = filteredRecords.length;
    const processed = filteredRecords.filter(r => r.status === "processed").length;
    const total_users = users.length;
    
    // Calculate total wallet disbursed (sum of all potential_ccc_value of verified records)
    const total_wallet = filteredRecords.filter(r => r.mrv_status === "verified").reduce((sum, r) => sum + (r.potential_ccc_value || 0), 0);

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
  app.get("/api/admin/fraud-map", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records.filter(r => r.mrv_status === "rejected" || r.status === "flagged");
    
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    res.json({ flagged_events: filteredRecords });
  });

  // ================================
  // DPI INTEGRATIONS (AGRISTACK & ONDC)
  // ================================
  app.get("/api/integrations/agristack", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    // Generate mock AgriStack verifications based on farmers
    const verifications = farmers.map(f => ({
      id: `AG-${f.farmer_id}`,
      farmer_id: f.farmer_id,
      name: f.name,
      land_parcel: `${(Math.random() * 5 + 0.5).toFixed(1)} Hectares`,
      crop: ['Wheat', 'Rice', 'Sugarcane', 'Cotton'][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.1 ? 'Verified' : 'Pending',
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    res.json(verifications);
  });

  app.get("/api/integrations/ondc", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    // Generate mock ONDC listings based on verified records
    const listings = records
      .filter(r => r.mrv_status === "verified")
      .slice(0, 10)
      .map((r, i) => ({
        id: `ONDC-${r.id.substring(0, 6)}`,
        material: r.waste_type,
        quantity: `${r.weight_kg} kg`,
        price: `₹${(r.weight_kg * 15).toFixed(2)}`,
        status: i % 3 === 0 ? 'Sold' : 'Active',
        listed_by: r.processor_id || r.aggregator_id || 'System',
        timestamp: r.timestamp
      }));
    res.json(listings);
  });

  // ================================
  // CCC POOL STATUS
  // ================================
  app.get("/api/ccc/pool", auth(["ccc_buyer", "regulator", "super_admin", "state_admin", "municipal_admin", "csr_partner", "epr_partner"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records.filter(r => r.mrv_status === "verified");
    
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    const total_minted = filteredRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);
    res.json({ total_ccc_units_minted: total_minted });
  });

  app.get("/api/admin/dashboard", auth(["state_admin", "municipal_admin", "super_admin", "regulator", "csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
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
      } else if (['csr_partner', 'epr_partner', 'ccc_buyer'].includes(role)) {
        filteredRecords = filteredRecords.filter(r => filteredUsers.some(u => u.id === r.purchased_by));
      } else {
        filteredRecords = [];
      }
    }

    const totalUsers = filteredUsers.length;
    const totalRecords = filteredRecords.length;
    const totalWallet = filteredUsers.reduce((sum, u) => sum + (u.wallet_balance || 0), 0);
    const totalWeight = filteredRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    const totalCCC = filteredRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);

    res.json({
      total_users: totalUsers,
      total_biomass_records: totalRecords,
      total_wallet_disbursed: totalWallet,
      total_ccc_amount_kg: totalCCC,
      total_weight_kg: totalWeight
    });
  });

  app.get("/api/admin/users", auth(["super_admin", "state_admin"]), (req: any, res) => {
    res.json(users.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    }));
  });

  app.post("/api/admin/users/role", auth(["super_admin"]), (req: any, res) => {
    const { user_id, new_role } = req.body;
    const user = users.find(u => u.id === user_id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.role = new_role;
    res.json({ message: `Role updated to ${new_role} for user ${user.name}` });
  });

  app.post("/api/admin/users/delete", auth(["super_admin"]), (req: any, res) => {
    const { user_id } = req.body;
    const index = users.findIndex(u => u.id === user_id);
    if (index !== -1) {
      users.splice(index, 1);
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  app.post("/api/admin/broadcast", auth(["super_admin", "state_admin"]), (req: any, res) => {
    const { message, target_role } = req.body;
    const newNotification = {
      id: "NOTIF_" + Date.now(),
      user_id: target_role || "all",
      message,
      read: false,
      timestamp: new Date().toISOString(),
      type: "broadcast"
    };
    notifications.push(newNotification);
    res.json({ message: "Broadcast sent successfully" });
  });

  app.get("/api/admin/system-health", auth(["super_admin", "state_admin"]), (req, res) => {
    res.json({
      status: "healthy",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      db_status: dbStatus,
      active_connections: users.length + 5, // Simulated
      last_backup: new Date(Date.now() - 3600000).toISOString()
    });
  });

  // ================================
  // KPI DASHBOARD
  // ================================
  app.get("/api/dashboard/kpi", auth(["super_admin", "state_admin", "municipal_admin", "aggregator"]), (req: any, res) => {
    const total_farmers = farmers.length;
    const total_events = records.length;
    const total_biomass_tonnes = records.reduce((sum, r) => sum + (r.weight_kg || 0), 0) / 1000;
    const total_ccc_amount_estimate = records.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);

    res.json({
      total_farmers,
      total_events,
      total_biomass_tonnes: Number(total_biomass_tonnes.toFixed(2)),
      total_ccc_amount_estimate: Number(total_ccc_amount_estimate.toFixed(2))
    });
  });

  app.get("/api/audit-logs", auth(["state_admin", "municipal_admin", "super_admin", "regulator", "csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    res.json(logs.slice(-50).reverse());
  });

  // ---------------- ANALYTICS & METRICS ----------------
  app.get("/api/analytics/comprehensive", auth(["super_admin", "state_admin", "municipal_admin", "regulator", "csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    const { context } = req.query;
    let filteredRecords = records;
    if (context && context !== 'all') {
      filteredRecords = filteredRecords.filter(r => r.context === context);
    }

    const verifiedRecords = filteredRecords.filter(r => r.mrv_status === "verified");
    
    // Environmental Metrics
    const total_ccc_amount_kg = verifiedRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0);
    const methane_avoided_kg = total_ccc_amount_kg * 0.21; // Simulated ratio
    const water_saved_liters = total_ccc_amount_kg * 150; // Simulated ratio
    const trees_equivalent = total_ccc_amount_kg / 20;

    // Economic Metrics
    const total_farmer_earnings = verifiedRecords.reduce((sum, r) => sum + (r.total_value || 0), 0);
    const avg_price_per_kg = total_farmer_earnings / (verifiedRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0) || 1);
    const govt_cost_savings = total_ccc_amount_kg * 5; // Simulated savings in waste management costs

    // Operational Metrics
    const total_weight = filteredRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    const processed_weight = filteredRecords.filter(r => r.status === "processed").reduce((sum, r) => sum + (r.weight_kg || 0), 0);
    const processing_efficiency = (processed_weight / (total_weight || 1)) * 100;
    
    // MRV Metrics
    const total_mrv_processed = filteredRecords.filter(r => r.mrv_status !== "pending").length;
    const rejection_rate = (filteredRecords.filter(r => r.mrv_status === "rejected").length / (total_mrv_processed || 1)) * 100;

    res.json({
      environmental: {
        ccc_offset_kg: Number(total_ccc_amount_kg.toFixed(2)),
        methane_avoided_kg: Number(methane_avoided_kg.toFixed(2)),
        water_saved_liters: Number(water_saved_liters.toFixed(0)),
        trees_equivalent: Number(trees_equivalent.toFixed(1))
      },
      economic: {
        total_farmer_earnings: Number(total_farmer_earnings.toFixed(2)),
        avg_price_per_kg: Number(avg_price_per_kg.toFixed(2)),
        govt_cost_savings: Number(govt_cost_savings.toFixed(2))
      },
      operational: {
        total_weight_kg: total_weight,
        processing_efficiency: Number(processing_efficiency.toFixed(1)),
        rejection_rate: Number(rejection_rate.toFixed(1))
      }
    });
  });

  app.get("/api/analytics/trends", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    // Group records by month for the last 6 months
    const now = new Date();
    const trends = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      const monthRecords = records.filter(r => {
        const d = new Date(r.timestamp);
        return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
      });
      
      trends.push({
        month: monthName,
        weight: monthRecords.reduce((sum, r) => sum + (r.weight_kg || 0), 0),
        events: monthRecords.length,
        ccc: monthRecords.reduce((sum, r) => sum + (r.ccc_amount_kg || 0), 0)
      });
    }
    
    res.json(trends);
  });

  // ---------------- WASTE CONFIGURATION ----------------
  app.get("/api/waste-types", (req, res) => {
    res.json(dynamicWasteTypes);
  });

  app.post("/api/waste-types", auth(["super_admin"]), (req: any, res) => {
    const { wasteTypes } = req.body;
    if (!Array.isArray(wasteTypes)) {
      return res.status(400).json({ error: "Invalid payload format" });
    }
    dynamicWasteTypes = wasteTypes;
    
    logs.push({ 
      id: Date.now(), 
      event: "WASTE_CONFIG_UPDATED", 
      details: `Waste types configuration updated by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    
    res.json({ message: "Waste configuration updated successfully", wasteTypes: dynamicWasteTypes });
  });

  app.get("/api/payment-config", (req, res) => {
    res.json(paymentConfig);
  });

  app.post("/api/payment-config", auth(["super_admin"]), (req: any, res) => {
    const { ccc_price_per_kg, logistics_margin_percent } = req.body;
    if (typeof ccc_price_per_kg === 'number') paymentConfig.ccc_price_per_kg = ccc_price_per_kg;
    if (typeof logistics_margin_percent === 'number') paymentConfig.logistics_margin_percent = logistics_margin_percent;
    
    logs.push({ 
      id: Date.now(), 
      event: "PAYMENT_CONFIG_UPDATED", 
      details: `Payment configuration updated by ${req.user.id}`, 
      timestamp: new Date().toISOString() 
    });
    
    res.json({ message: "Payment configuration updated successfully", paymentConfig });
  });

  // ---------------- STATUS & INTERNAL ----------------
  app.get("/api/status", (req, res) => {
    res.json({ service: "RUPAYKG", issuer: "ALLIANCEVENTURES", auth: "RS256", status: "Active" });
  });

  app.get("/api/ccc", auth(["super_admin", "state_admin", "regulator", "ccc_buyer"]), (req: any, res: any) => {
    res.json({ message: "CCC Secure Data", user: req.user });
  });

  app.get("/api/blockchain/ledger", auth(["super_admin", "state_admin", "municipal_admin", "regulator", "csr_partner", "epr_partner", "ccc_buyer"]), (req: any, res) => {
    res.json(blockchain);
  });

  app.get("/api/blockchain/verify", (req, res) => {
    let isValid = true;
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const previousBlock = blockchain[i - 1];
      
      const recalculatedHash = calculateHash(
        currentBlock.index, 
        currentBlock.timestamp, 
        currentBlock.data, 
        currentBlock.previousHash
      );
      
      if (currentBlock.hash !== recalculatedHash || currentBlock.previousHash !== previousBlock.hash) {
        isValid = false;
        break;
      }
    }
    res.json({ isValid });
  });

  app.get("/internal/metrics", async (req, res) => {
    const token = req.headers["x-service-token"];
    if (token !== INTERNAL_TOKEN) return res.status(403).json({ error: "Forbidden" });
    res.json({ wasteProcessedMT: 1320, cccsIssued: 56000, totalRevenue: 14000000 });
  });

  app.get("/api/map/environmental-activity", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), (req: any, res) => {
    // Stub for geospatial map data (combining Mapbox, OpenStreetMap, Earth Engine)
    const mapData = {
      waste_points: records.map(r => ({ lat: r.geo_lat, lng: r.geo_long, type: r.waste_type, weight: r.weight_kg })),
      biomass_zones: farmers.map(f => ({ lat: f.geo_lat, lng: f.geo_long, crop: f.crop_type, area: f.land_area })),
      heatmaps: {
        ccc_generation: records.filter(r => r.mrv_status === 'verified').map(r => ({ lat: r.geo_lat, lng: r.geo_long, intensity: r.ccc_amount_kg }))
      }
    };
    res.json(mapData);
  });

  // ---------------- WHATSAPP WEBHOOK ----------------
  app.post("/api/whatsapp/webhook", async (req: any, res: any) => {
    // This endpoint simulates a Twilio/Meta WhatsApp webhook
    // In production, this receives a payload from the WhatsApp Business API
    const { Body, From, MediaUrl0 } = req.body;
    
    // Extract phone number (e.g., "whatsapp:+919876543210" -> "9876543210")
    const phone = From ? From.replace("whatsapp:+91", "").replace("whatsapp:", "") : "unknown";
    
    // Find if the user is onboarded in the pilot
    let user;
    if (dbStatus === "connected") {
      user = await PilotOnboarding.findOne({ phone }) || await User.findOne({ phone });
    } else {
      user = pilotOnboarding.find(u => u.phone === phone) || users.find(u => u.phone === phone);
    }
    
    if (!user) {
      // Send a response back to Twilio/Meta using TwiML or Meta Graph API
      // For now, we return a mock response
      return res.status(200).send(`
        <Response>
          <Message>Welcome to RupayKg CCC OS! You are not registered. Please contact your supervisor to onboard.</Message>
        </Response>
      `);
    }

    const messageText = Body ? Body.toLowerCase().trim() : "";
    let responseMessage = "";

    if (messageText.includes("log") || MediaUrl0) {
      // Very basic parsing for demo: "Log 50kg plastic"
      let weight = 0;
      let wasteType = "mixed";
      
      const weightMatch = messageText.match(/(\d+)\s*(kg|kilos)/i);
      if (weightMatch) weight = parseInt(weightMatch[1]);
      
      if (messageText.includes("plastic")) wasteType = "plastic";
      else if (messageText.includes("organic")) wasteType = "organic";

      // If they just sent a photo without text, we assume a default or ask for details
      if (MediaUrl0 && weight === 0) {
        responseMessage = "Photo received! Please reply with the weight and type (e.g., '50kg plastic').";
      } else {
        const emission_factor = wasteType === 'organic' ? 0.5 : (wasteType === 'plastic' ? 0.8 : 0.4);
        const estimatedCCC = (weight * emission_factor) / 1000;

        const logEntry = {
          id: "PILOT_WA_" + Date.now().toString(),
          weight: weight || 10, // Default to 10 if parsing failed but they sent a photo
          wasteType,
          location: user.location || user.district || "Unknown",
          photoUrl: MediaUrl0 || null,
          collectorId: user.id,
          timestamp: new Date().toISOString(),
          estimatedCCC,
          isValidated: false,
          validationScore: null,
          validationExplanation: null,
          status: 'logged',
          source: 'whatsapp'
        };
        
        if (dbStatus === "connected") {
          await PilotRecord.create(logEntry);
        } else {
          pilotRecords.push(logEntry);
        }
        responseMessage = `✅ Successfully logged ${logEntry.weight}kg of ${wasteType} waste! Estimated CCC Impact: ${estimatedCCC.toFixed(3)} tCO2e.`;
      }
    } else if (messageText === "stats") {
      let userLogs;
      if (dbStatus === "connected") {
        userLogs = await PilotRecord.find({ collectorId: user.id });
      } else {
        userLogs = pilotRecords.filter(r => r.collectorId === user.id);
      }
      const totalWeight = userLogs.reduce((sum: any, r: any) => sum + Number(r.weight), 0);
      responseMessage = `📊 Your Stats:\nTotal Logs: ${userLogs.length}\nTotal Weight: ${totalWeight}kg`;
    } else {
      responseMessage = `Hi ${user.name}! 🌍\nSend a photo of waste or type 'log [weight]kg [type]' to record collection.\nType 'stats' to see your impact.`;
    }

    // Return TwiML response for Twilio
    res.set('Content-Type', 'text/xml');
    res.status(200).send(`
      <Response>
        <Message>${responseMessage}</Message>
      </Response>
    `);
  });

  // ---------------- PILOT ENGINE ROUTES ----------------
  app.post("/api/pilot/onboard", auth(["super_admin", "state_admin", "municipal_admin"]), async (req, res) => {
    const { name, role, phone, location } = req.body;
    const onboardEntry = {
      id: Date.now().toString(),
      name,
      role, // 'collector' | 'aggregator' | 'supervisor'
      phone,
      location,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    
    if (dbStatus === "connected") {
      await PilotOnboarding.create(onboardEntry);
    } else {
      pilotOnboarding.push(onboardEntry);
    }
    
    res.json({ message: "Onboarded successfully", entry: onboardEntry });
  });

  app.post("/api/pilot/log", auth(["citizen", "fpo", "aggregator", "super_admin"]), async (req: any, res: any) => {
    const { weight, wasteType, location, photoUrl, collectorId } = req.body;
    
    // Simple CCC Estimation (MRV Light)
    const emission_factor = wasteType === 'organic' ? 0.5 : (wasteType === 'plastic' ? 0.8 : 0.4);
    const estimatedCCC = (weight * emission_factor) / 1000; // in tCO2e

    const logEntry = {
      id: "PILOT_" + Date.now().toString(),
      weight,
      wasteType,
      location,
      photoUrl,
      collectorId: collectorId || req.user.id,
      timestamp: new Date().toISOString(),
      estimatedCCC,
      isValidated: false,
      validationScore: null,
      validationExplanation: null,
      status: 'logged'
    };
    
    if (dbStatus === "connected") {
      await PilotRecord.create(logEntry);
    } else {
      pilotRecords.push(logEntry);
    }

    try {
      // Enrich pilot log with Carbon Intelligence
      // Map pilot log to standard record format for engine
      const tempRecord = {
        id: logEntry.id,
        weight_kg: weight,
        waste_type: wasteType === 'organic' ? 'Food & Kitchen Waste' : (wasteType === 'plastic' ? 'PET Bottles (Clear)' : 'Agricultural'),
        geo_lat: location?.split(',')[0] || 0,
        geo_long: location?.split(',')[1] || 0,
        citizen_id: req.user.id,
        context: 'rural'
      };
      const carbonEvent = generateCarbonEvent(tempRecord, { value: 5, ccc_factor: emission_factor });
      carbonEvents.push(carbonEvent);
      logEntry.carbon_event_id = carbonEvent.id;
      logEntry.net_carbon_reduction = carbonEvent.net_carbon_reduction_kg_co2e;
    } catch (err) {
      console.error("Failed to enrich pilot log with carbon intelligence:", err);
    }
    
    res.json({ message: "Waste logged successfully", entry: logEntry });
  });

  app.get("/api/pilot/stats", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), async (req, res) => {
    let currentPilotRecords;
    let currentPilotOnboarding;
    
    if (dbStatus === "connected") {
      currentPilotRecords = await PilotRecord.find();
      currentPilotOnboarding = await PilotOnboarding.find();
    } else {
      currentPilotRecords = pilotRecords;
      currentPilotOnboarding = pilotOnboarding;
    }

    const totalWeight = currentPilotRecords.reduce((sum: any, r: any) => sum + (r.weight || 0), 0);
    const totalCCCs = currentPilotRecords.reduce((sum: any, r: any) => sum + (r.estimatedCCC || 0), 0);
    const onboardedCount = currentPilotOnboarding.length;
    const verifiedCount = currentPilotRecords.filter((r: any) => r.status === 'validated').length;
    
    // Mock trends for the last 7 days
    const trends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dateStr = date.toISOString().split('T')[0];
      const dayWeight = currentPilotRecords
        .filter((r: any) => r.timestamp.startsWith(dateStr))
        .reduce((sum: any, r: any) => sum + (r.weight || 0), 0);
      return {
        date: date.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
        weight: dayWeight || Math.floor(Math.random() * 200) + 100 // Fallback mock data
      };
    });

    res.json({
      totalWeight,
      totalCCCs,
      onboardedCount,
      verifiedCount,
      trends,
      recentLogs: currentPilotRecords.slice(-5).reverse()
    });
  });

  app.post("/api/pilot/validate", auth(["super_admin", "state_admin", "municipal_admin", "regulator"]), async (req, res) => {
    const { record_id, validationScore, validationExplanation } = req.body;
    
    let record;
    if (dbStatus === "connected") {
      record = await PilotRecord.findOne({ id: record_id });
    } else {
      record = pilotRecords.find(r => r.id === record_id);
    }
    
    if (!record) return res.status(404).json({ error: "Record not found" });

    const score = validationScore || 100;
    const explanation = validationExplanation || "Manual validation";

    if (dbStatus === "connected") {
      await PilotRecord.updateOne(
        { id: record_id },
        { 
          validationScore: score,
          validationExplanation: explanation,
          status: score > 70 ? 'validated' : 'flagged'
        }
      );
    } else {
      record.validationScore = score;
      record.validationExplanation = explanation;
      record.status = score > 70 ? 'validated' : 'flagged';
    }

    res.json({ message: "Validation complete", result: { confidence_score: score, explanation } });
  });

  app.get("/api/pilot/playbook", (req, res) => {
    res.json({
      onboarding: [
        {
          title: "Initial Contact & Trust Building",
          description: "Approach the waste collector with respect. Explain that RupayKg is a government-aligned platform to increase their income.",
          script: "नमस्ते! हम 'रुपयकेजी' से हैं। हम आपके काम को डिजिटल बना रहे हैं ताकि आपको कचरे के सही दाम और CCC का पैसा मिल सके।"
        },
        {
          title: "Digital Identity Creation",
          description: "Use the Onboard form to register their phone number and area. Explain that this ID is their key to payments.",
          script: "आपका नाम और फोन नंबर रजिस्टर कर लेते हैं। अब से आप जो भी कचरा जमा करेंगे, उसका हिसाब इस ऐप में रहेगा।"
        },
        {
          title: "Waste Logging & Photo Proof",
          description: "Demonstrate how to weigh the waste and take a clear photo. Photo must show the scale and the waste type.",
          script: "कचरा तौलने के बाद उसकी फोटो खींचना ज़रूरी है। फोटो में वजन साफ़ दिखना चाहिए।"
        }
      ]
    });
  });

  app.get("/api/pilot/report", auth(["super_admin", "state_admin", "municipal_admin"]), async (req, res) => {
    res.status(404).json({ error: "Report generation moved to frontend" });
  });

  // ========================================================
  // CARBON API INTEGRATION
  // ========================================================
  
  app.get("/api/carbon/dashboard", auth(), (req: any, res) => {
    const totalReduction = carbonEvents.reduce((acc, ev) => acc + (ev.net_carbon_reduction_kg_co2e || 0), 0);
    const totalDiverted = carbonEvents.reduce((acc, ev) => acc + (ev.diversion_estimate_kg_co2e || 0), 0);
    const totalMethane = carbonEvents.reduce((acc, ev) => acc + (ev.methane_estimate_kg_co2e || 0), 0);
    
    res.json({
      total_carbon_reduction_kg_co2e: totalReduction,
      total_diverted_kg_co2e: totalDiverted,
      total_methane_avoided_kg_co2e: totalMethane,
      events_count: carbonEvents.length,
      average_mrv_score: carbonEvents.length > 0 ? carbonEvents.reduce((acc, ev) => acc + ev.mrv_score, 0) / carbonEvents.length : 0,
      carbonEvents
    });
  });

  app.post("/api/carbon/calculate", auth(), (req: any, res) => {
    // Allows testing the carbon engine manually
    const record = req.body;
    const wasteConfig = dynamicWasteTypes.find(w => w.type === record.waste_type) || { value: 5, ccc_factor: 0.5 };
    const carbonEvent = generateCarbonEvent(record, wasteConfig);
    res.json(carbonEvent);
  });
  
  app.get("/api/carbon/mrv", auth(["regulator", "super_admin"]), (req: any, res) => {
    res.json({ carbonEvents });
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
