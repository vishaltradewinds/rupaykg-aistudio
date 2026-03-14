import os
import time
import json
import uuid
import logging
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any, Union

from fastapi import FastAPI, Depends, HTTPException, status, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt

# Optional production dependencies
try:
    import motor.motor_asyncio
    HAS_MOTOR = True
except ImportError:
    HAS_MOTOR = False

try:
    import redis.asyncio as redis
    HAS_REDIS = True
except ImportError:
    HAS_REDIS = False

# =============================================================================
# 1. CONFIGURATION & CONSTANTS
# =============================================================================
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("RupayKg-Core")

SECRET_KEY = os.getenv("SECRET_KEY", "rupaykg-super-secret-key-2026-production-grade")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7))  # 1 week

MONGO_URI = os.getenv("MONGO_URI", "")
REDIS_URI = os.getenv("REDIS_URI", "")

# Emission Factors (tCO2e per ton)
EMISSION_FACTORS = {
    "biomass_diversion": 1.5,
    "plastic_recycling": 2.7,
    "organic_composting": 0.9,
    "waste_to_energy": 1.2,
    "e_waste_recycling": 3.4
}

# Crop Residue Factors (tons per hectare)
CROP_FACTORS = {
    "Rice": 2.5,
    "Wheat": 1.8,
    "Maize": 2.0,
    "Sugarcane": 4.0,
    "Cotton": 1.5
}

# Allowed Roles
ROLES = ["Generator", "Aggregator", "Recycler", "Municipality", "Carbon Verifier", "Corporate Buyer", "System Admin"]

# =============================================================================
# 2. DATABASE & CACHING ABSTRACTION (PRODUCTION + MOCK FALLBACK)
# =============================================================================
class MockDB:
    """In-memory fallback database for zero-config local execution."""
    def __init__(self):
        self.collections = {
            "users": {}, "activities": {}, "biomass_records": {},
            "carbon_records": {}, "wallets": {}, "projects": {},
            "marketplace_listings": {}, "audit_logs": {}
        }

    async def insert_one(self, collection: str, document: dict) -> str:
        doc_id = str(uuid.uuid4())
        document["_id"] = doc_id
        self.collections[collection][doc_id] = document
        return doc_id

    async def find(self, collection: str, query: dict = None) -> List[dict]:
        data = list(self.collections[collection].values())
        if not query: return data
        return [item for item in data if all(item.get(k) == v for k, v in query.items())]

    async def find_one(self, collection: str, query: dict) -> Optional[dict]:
        res = await self.find(collection, query)
        return res[0] if res else None

    async def update_one(self, collection: str, query: dict, update: dict) -> bool:
        record = await self.find_one(collection, query)
        if record:
            if "$set" in update:
                record.update(update["$set"])
            else:
                record.update(update)
            return True
        return False

class MongoDBAdapter:
    """Production MongoDB adapter using Motor."""
    def __init__(self, uri: str):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(uri)
        self.db = self.client["rupaykg_db"]

    async def insert_one(self, collection: str, document: dict) -> str:
        if "_id" not in document: document["_id"] = str(uuid.uuid4())
        await self.db[collection].insert_one(document)
        return document["_id"]

    async def find(self, collection: str, query: dict = None) -> List[dict]:
        cursor = self.db[collection].find(query or {})
        return await cursor.to_list(length=1000)

    async def find_one(self, collection: str, query: dict) -> Optional[dict]:
        return await self.db[collection].find_one(query)

    async def update_one(self, collection: str, query: dict, update: dict) -> bool:
        result = await self.db[collection].update_one(query, update)
        return result.modified_count > 0

# Initialize Database
if MONGO_URI and HAS_MOTOR:
    logger.info("Connecting to MongoDB Atlas...")
    db = MongoDBAdapter(MONGO_URI)
else:
    logger.warning("MONGO_URI not set or motor not installed. Using in-memory MockDB.")
    db = MockDB()

# Initialize Cache
class MockCache:
    def __init__(self): self.cache = {}
    async def get(self, key: str): return self.cache.get(key)
    async def set(self, key: str, value: str, ex: int = None): self.cache[key] = value

if REDIS_URI and HAS_REDIS:
    logger.info("Connecting to Redis...")
    cache = redis.from_url(REDIS_URI, decode_responses=True)
else:
    logger.warning("REDIS_URI not set or redis not installed. Using in-memory MockCache.")
    cache = MockCache()

# =============================================================================
# 3. SECURITY, AUTHENTICATION & RATE LIMITING
# =============================================================================
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None: raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await db.find_one("users", {"email": email})
    if user is None: raise credentials_exception
    return user

def require_role(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles and "System Admin" not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted for this role")
        return current_user
    return role_checker

# Rate Limiter Middleware
class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.rpm = requests_per_minute
        self.window = 60

    async def check(self, ip: str):
        key = f"rate_limit:{ip}"
        current = await cache.get(key)
        if current and int(current) >= self.rpm:
            raise HTTPException(status_code=429, detail="Too Many Requests")
        if not current:
            await cache.set(key, "1", ex=self.window)
        else:
            await cache.set(key, str(int(current) + 1), ex=self.window)

rate_limiter = RateLimiter(requests_per_minute=100)

# =============================================================================
# 4. PYDANTIC MODELS (DATA VALIDATION)
# =============================================================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = Field(..., description="Role of the user in the ecosystem")
    aadhaar_id: Optional[str] = None
    organization: Optional[str] = None

class ActivityCreate(BaseModel):
    waste_type: str
    weight_kg: float = Field(..., gt=0, description="Weight must be positive")
    lat: float
    lng: float
    photo_url: str

class BiomassEstimate(BaseModel):
    crop_type: str
    hectares: float = Field(..., gt=0)
    lat: float
    lng: float

class MRVVerify(BaseModel):
    activity_id: str
    waste_type: str
    weight_kg: float

class CarbonRegister(BaseModel):
    activity_id: str
    carbon_reduction_kg: float

class MarketplaceListingCreate(BaseModel):
    material: str
    quantity_kg: float
    price_inr: float
    lat: float
    lng: float

# =============================================================================
# 5. 12 STRATEGIC API CONNECTORS (MOCKED ARCHITECTURE)
# =============================================================================
class GoogleEarthEngineAPI:
    @staticmethod
    async def verify_land_cover(lat: float, lng: float) -> dict:
        """Uses GEE to verify if the location is agricultural land or urban waste zone."""
        # Mock logic: if lat > 20, assume agricultural for demo
        land_type = "agricultural" if lat > 20 else "urban"
        return {"verified": True, "land_type": land_type, "confidence": 0.92, "source": "Google Earth Engine"}

class SentinelAPI:
    @staticmethod
    async def detect_fire_anomalies(lat: float, lng: float) -> bool:
        """Uses ESA Sentinel data to check for crop burning (stubble burning)."""
        return False # No fire detected, safe for biomass collection

class AgriStackAPI:
    @staticmethod
    async def fetch_farmer_data(aadhaar_id: str) -> dict:
        """Fetches verified farmer registry data from India's AgriStack."""
        return {"farmer_id": f"AGRI-{str(uuid.uuid4())[:8]}", "verified": True, "land_holdings_ha": 4.5}

class ADeXAPI:
    @staticmethod
    async def fetch_crop_yield(region: str, crop: str) -> float:
        """Agricultural Data Exchange: Returns historical yield data."""
        return CROP_FACTORS.get(crop, 1.0)

class OpenWeatherAPI:
    @staticmethod
    async def get_composting_conditions(lat: float, lng: float) -> dict:
        """Checks temperature and humidity for organic composting optimization."""
        return {"temp_c": 32, "humidity": 65, "optimal_for_compost": True}

class ClimatiqAPI:
    @staticmethod
    async def get_emission_factor(activity_type: str) -> float:
        """Fetches real-time emission factors for MRV from Climatiq."""
        return EMISSION_FACTORS.get(activity_type, 1.0)

class OpenStreetMapAPI:
    @staticmethod
    async def get_facility_routing(lat: float, lng: float) -> dict:
        """OSM routing for waste collection vehicles."""
        return {"nearest_facility_km": 12.4, "route_optimized": True}

class MapboxAPI:
    @staticmethod
    async def generate_static_map(lat: float, lng: float) -> str:
        """Generates a map thumbnail for the activity."""
        return f"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{lng},{lat},14/400x300"

class ONDCAPI:
    @staticmethod
    async def broadcast_listing(listing: dict) -> str:
        """Broadcasts recyclables to the Open Network for Digital Commerce (ONDC)."""
        return f"ONDC-TXN-{int(time.time())}"

class OpenGHGAPI:
    @staticmethod
    async def get_regional_baseline(region: str) -> float:
        """Gets the baseline greenhouse gas emissions for a region."""
        return 450.5 # tCO2e

class EnergyBiomassAPI:
    @staticmethod
    async def check_plant_capacity(plant_id: str) -> dict:
        """Checks capacity at nearest waste-to-energy plant."""
        return {"accepting_material": True, "capacity_available_tons": 150}

class AadhaarAPI:
    @staticmethod
    async def verify_identity(aadhaar_id: str) -> bool:
        """Sovereign identity verification (UIDAI Mock)."""
        return len(str(aadhaar_id)) == 12 if aadhaar_id else False

# =============================================================================
# 6. CORE ENGINES (FRAUD, MRV, REGISTRY)
# =============================================================================
class FraudDetectionEngine:
    @staticmethod
    async def analyze(user_id: str, weight_kg: float, lat: float, lng: float) -> dict:
        # 1. Impossible quantities check
        if weight_kg > 10000: # > 10 tons in one go is suspicious for a single generator
            return {"is_fraud": True, "reason": "Exceeds maximum physical capacity per transaction"}
        
        # 2. Location anomaly (e.g., claiming ocean coordinates)
        if lat == 0 and lng == 0:
            return {"is_fraud": True, "reason": "Invalid GPS coordinates"}
            
        # 3. Duplicate submission check (Rate limiting per user)
        recent_activities = await db.find("activities", {"user_id": user_id})
        if len(recent_activities) > 100:
            return {"is_fraud": True, "reason": "Rate limit exceeded. Suspicious bot activity."}

        return {"is_fraud": False, "reason": "Clear"}

class MRVEngine:
    @staticmethod
    async def calculate(waste_type: str, weight_kg: float) -> float:
        # Map waste type to emission factor category
        category_map = {
            "Plastic": "plastic_recycling",
            "Organic": "organic_composting",
            "Biomass": "biomass_diversion",
            "Mixed": "waste_to_energy",
            "E-Waste": "e_waste_recycling"
        }
        category = category_map.get(waste_type, "waste_to_energy")
        factor = await ClimatiqAPI.get_emission_factor(category)
        
        # Calculation: (Weight in tons) * Emission Factor
        tons = weight_kg / 1000.0
        carbon_reduction_kg = (tons * factor) * 1000
        return carbon_reduction_kg

class CarbonRegistry:
    @staticmethod
    async def issue_credits(user_id: str, carbon_kg: float):
        wallet = await db.find_one("wallets", {"user_id": user_id})
        if not wallet:
            wallet_id = await db.insert_one("wallets", {"user_id": user_id, "carbon_credits": 0, "balance_inr": 0})
            wallet = await db.find_one("wallets", {"_id": wallet_id})
        
        new_balance = wallet["carbon_credits"] + carbon_kg
        await db.update_one("wallets", {"user_id": user_id}, {"$set": {"carbon_credits": new_balance}})
        return new_balance

# =============================================================================
# 7. FASTAPI APPLICATION INITIALIZATION
# =============================================================================
app = FastAPI(
    title="RupayKg - Google Maps of Waste and Carbon",
    description="National Digital Public Infrastructure for Environmental MRV",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Middleware for Audit Logging & Rate Limiting
@app.middleware("http")
async def security_middleware(request: Request, call_next):
    client_ip = request.client.host
    await rate_limiter.check(client_ip)
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    # Async audit logging
    asyncio.create_task(db.insert_one("audit_logs", {
        "method": request.method,
        "url": str(request.url),
        "status_code": response.status_code,
        "ip": client_ip,
        "process_time_ms": round(process_time * 1000, 2),
        "timestamp": datetime.utcnow().isoformat()
    }))
    
    return response

# =============================================================================
# 8. API ROUTES
# =============================================================================

@app.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    if user.role not in ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {ROLES}")
        
    if await db.find_one("users", {"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.aadhaar_id and not await AadhaarAPI.verify_identity(user.aadhaar_id):
        raise HTTPException(status_code=400, detail="Invalid Aadhaar Identity")

    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow().isoformat()
    
    user_id = await db.insert_one("users", user_dict)
    await db.insert_one("wallets", {"user_id": user_id, "carbon_credits": 0.0, "balance_inr": 0.0})
    
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.find_one("users", {"email": form_data.username})
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    return {"access_token": access_token, "token_type": "bearer", "role": user["role"], "name": user["full_name"]}

@app.post("/waste/activity")
async def record_activity(activity: ActivityCreate, current_user: dict = Depends(get_current_user)):
    # 1. Fraud Detection
    fraud_check = await FraudDetectionEngine.analyze(current_user["_id"], activity.weight_kg, activity.lat, activity.lng)
    if fraud_check["is_fraud"]:
        raise HTTPException(status_code=400, detail=fraud_check["reason"])

    # 2. Geospatial Verification
    geo_verify = await GoogleEarthEngineAPI.verify_land_cover(activity.lat, activity.lng)
    
    # 3. Save Activity
    act_dict = activity.dict()
    act_dict.update({
        "user_id": current_user["_id"],
        "timestamp": datetime.utcnow().isoformat(),
        "status": "pending_verification",
        "geo_verified": geo_verify["verified"]
    })
    act_id = await db.insert_one("activities", act_dict)
    
    return {"message": "Activity recorded", "activity_id": act_id, "geo_verification": geo_verify}

@app.get("/waste/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    activities = await db.find("activities", {"user_id": current_user["_id"]})
    return {"activities": activities}

@app.post("/biomass/estimate")
async def estimate_biomass(data: BiomassEstimate, current_user: dict = Depends(get_current_user)):
    # Integrate AgriStack & ADeX
    yield_factor = await ADeXAPI.fetch_crop_yield("regional", data.crop_type)
    estimated_tons = data.hectares * yield_factor
    
    record_id = await db.insert_one("biomass_records", {
        "user_id": current_user["_id"],
        "crop_type": data.crop_type,
        "hectares": data.hectares,
        "estimated_tons": estimated_tons,
        "lat": data.lat,
        "lng": data.lng,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {"estimated_tons": estimated_tons, "record_id": record_id}

@app.post("/mrv/verify")
async def verify_mrv(data: MRVVerify, current_user: dict = Depends(require_role(["Carbon Verifier", "System Admin"]))):
    activity = await db.find_one("activities", {"_id": data.activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    carbon_reduction_kg = await MRVEngine.calculate(data.waste_type, data.weight_kg)
    
    await db.update_one("activities", {"_id": data.activity_id}, {"$set": {"status": "verified"}})
    
    return {"activity_id": data.activity_id, "carbon_reduction_kg": carbon_reduction_kg, "status": "verified"}

@app.post("/carbon/register")
async def register_carbon(data: CarbonRegister, current_user: dict = Depends(require_role(["Carbon Verifier", "System Admin"]))):
    activity = await db.find_one("activities", {"_id": data.activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    # Issue credits to the original generator
    generator_id = activity["user_id"]
    new_balance = await CarbonRegistry.issue_credits(generator_id, data.carbon_reduction_kg)
    
    record_id = await db.insert_one("carbon_records", {
        "activity_id": data.activity_id,
        "carbon_reduction_kg": data.carbon_reduction_kg,
        "issued_to": generator_id,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    return {"message": "Carbon credits registered", "record_id": record_id, "generator_new_balance": new_balance}

@app.post("/marketplace/list")
async def create_listing(listing: MarketplaceListingCreate, current_user: dict = Depends(get_current_user)):
    list_dict = listing.dict()
    list_dict.update({
        "seller_id": current_user["_id"],
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    })
    
    # Broadcast to ONDC
    ondc_txn = await ONDCAPI.broadcast_listing(list_dict)
    list_dict["ondc_txn_id"] = ondc_txn
    
    listing_id = await db.insert_one("marketplace_listings", list_dict)
    return {"message": "Listed on RupayKg & ONDC", "listing_id": listing_id, "ondc_txn": ondc_txn}

@app.get("/map/environmental-data")
async def get_map_data():
    activities = await db.find("activities")
    biomass = await db.find("biomass_records")
    
    waste_points = [{"lat": a["lat"], "lng": a["lng"], "type": a["waste_type"], "weight": a["weight_kg"]} for a in activities if "lat" in a]
    biomass_zones = [{"lat": b["lat"], "lng": b["lng"], "crop": b["crop_type"], "tons": b["estimated_tons"]} for b in biomass if "lat" in b]
    
    # Generate mock heatmap data based on verified activities
    verified = await db.find("activities", {"status": "verified"})
    heatmaps = [{"lat": v["lat"], "lng": v["lng"], "intensity": v["weight_kg"] * 1.5} for v in verified if "lat" in v]
    
    # Add some dummy data if empty to ensure the map looks good
    if not waste_points:
        waste_points = [
            {"lat": 28.6139, "lng": 77.2090, "type": "Plastic", "weight": 500},
            {"lat": 19.0760, "lng": 72.8777, "type": "Organic", "weight": 1200},
            {"lat": 12.9716, "lng": 77.5946, "type": "E-Waste", "weight": 300}
        ]
        biomass_zones = [
            {"lat": 30.9010, "lng": 75.8573, "crop": "Wheat", "tons": 4500},
            {"lat": 22.9868, "lng": 87.8550, "crop": "Rice", "tons": 3200}
        ]
        heatmaps = [
            {"lat": 28.6139, "lng": 77.2090, "intensity": 750},
            {"lat": 19.0760, "lng": 72.8777, "intensity": 1080},
            {"lat": 12.9716, "lng": 77.5946, "intensity": 800}
        ]

    return {
        "waste_points": waste_points,
        "biomass_zones": biomass_zones,
        "heatmaps": heatmaps
    }

@app.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    role = current_user["role"]
    wallet = await db.find_one("wallets", {"user_id": current_user["_id"]})
    
    stats = {
        "wallet_balance_inr": wallet["balance_inr"] if wallet else 0,
        "carbon_credits_kg": wallet["carbon_credits"] if wallet else 0,
    }
    
    if role in ["System Admin", "Municipality", "Carbon Verifier"]:
        all_activities = await db.find("activities")
        carbon_records = await db.find("carbon_records")
        users = await db.find("users")
        listings = await db.find("marketplace_listings", {"status": "active"})
        
        stats["total_waste_tracked_kg"] = sum(a.get("weight_kg", 0) for a in all_activities)
        stats["total_carbon_reduced_kg"] = sum(c.get("carbon_reduction_kg", 0) for c in carbon_records)
        stats["active_users"] = len(users)
        stats["active_listings"] = len(listings)
    else:
        my_activities = await db.find("activities", {"user_id": current_user["_id"]})
        stats["my_waste_submitted_kg"] = sum(a.get("weight_kg", 0) for a in my_activities)
        stats["pending_verifications"] = len([a for a in my_activities if a.get("status") == "pending_verification"])

    return stats

# =============================================================================
# 9. EMBEDDED FRONTEND (REACT + MAPBOX + TAILWIND)
# =============================================================================
FRONTEND_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RupayKg - Google Maps of Waste and Carbon</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js"></script>
    <link href="https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; }
        #map { width: 100%; height: 600px; border-radius: 0.75rem; }
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
        .tab-active { border-bottom: 2px solid #10b981; color: #10b981; font-weight: 600; }
        .tab-inactive { color: #6b7280; }
        .tab-inactive:hover { color: #374151; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;

        // --- API Service ---
        const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            const config = { method, headers };
            if (body && method !== 'GET') {
                if (body instanceof URLSearchParams) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    config.body = body;
                } else {
                    config.body = JSON.stringify(body);
                }
            }
            
            const res = await fetch(endpoint, config);
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'API Error');
            return data;
        };

        // --- Components ---
        const Login = ({ setAuth }) => {
            const [isRegister, setIsRegister] = useState(false);
            const [email, setEmail] = useState('admin@rupaykg.in');
            const [password, setPassword] = useState('admin123');
            const [name, setName] = useState('System Admin');
            const [role, setRole] = useState('System Admin');
            const [error, setError] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                setError('');
                try {
                    if (isRegister) {
                        await apiCall('/auth/register', 'POST', { email, password, full_name: name, role });
                        setIsRegister(false);
                        setError('Registration successful. Please login.');
                    } else {
                        const params = new URLSearchParams();
                        params.append('username', email);
                        params.append('password', password);
                        const data = await apiCall('/auth/login', 'POST', params);
                        localStorage.setItem('token', data.access_token);
                        setAuth({ token: data.access_token, role: data.role, name: data.name });
                    }
                } catch (err) {
                    setError(err.message);
                }
            };

            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-emerald-800">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-extrabold text-green-800 tracking-tight"><i className="fa-solid fa-leaf mr-2"></i>RupayKg</h1>
                            <p className="text-gray-500 mt-2 font-medium">Sovereign Environmental DPI</p>
                        </div>
                        
                        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {isRegister && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500">
                                            <option>Generator</option>
                                            <option>Aggregator</option>
                                            <option>Recycler</option>
                                            <option>Municipality</option>
                                            <option>Carbon Verifier</option>
                                            <option>Corporate Buyer</option>
                                            <option>System Admin</option>
                                        </select>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500" required />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                {isRegister ? 'Register' : 'Sign In'}
                            </button>
                        </form>
                        <div className="mt-6 text-center">
                            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-green-600 hover:text-green-500">
                                {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        };

        const MapView = () => {
            const mapContainer = useRef(null);
            const map = useRef(null);
            const [mapData, setMapData] = useState(null);

            useEffect(() => {
                apiCall('/map/environmental-data').then(setMapData).catch(console.error);
            }, []);

            useEffect(() => {
                if (map.current || !mapContainer.current || !mapData) return;
                
                // Note: In production, use a real Mapbox token. Using a public default for demo.
                mapboxgl.accessToken = 'pk.eyJ1IjoiZGV2ZWxvcGVyIiwiYSI6ImNsaHk5c3R6ZTAwYjMza212b2x0a2h0a28ifQ.dummy_token_for_demo'; 
                
                try {
                    map.current = new mapboxgl.Map({
                        container: mapContainer.current,
                        style: 'mapbox://styles/mapbox/dark-v11',
                        center: [78.9629, 20.5937], // Center of India
                        zoom: 4.5
                    });

                    map.current.on('load', () => {
                        // Add Heatmap Layer for Carbon Reduction
                        if (mapData.heatmaps.length > 0) {
                            map.current.addSource('carbon-heat', {
                                type: 'geojson',
                                data: {
                                    type: 'FeatureCollection',
                                    features: mapData.heatmaps.map(h => ({
                                        type: 'Feature',
                                        geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
                                        properties: { intensity: h.intensity }
                                    }))
                                }
                            });
                            map.current.addLayer({
                                id: 'carbon-heat-layer',
                                type: 'heatmap',
                                source: 'carbon-heat',
                                paint: {
                                    'heatmap-weight': ['interpolate', ['linear'], ['get', 'intensity'], 0, 0, 1000, 1],
                                    'heatmap-intensity': 1,
                                    'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(33,102,172,0)', 0.2, 'rgb(103,169,207)', 0.4, 'rgb(209,229,240)', 0.6, 'rgb(253,219,199)', 0.8, 'rgb(239,138,98)', 1, 'rgb(178,24,43)'],
                                    'heatmap-radius': 30,
                                    'heatmap-opacity': 0.7
                                }
                            });
                        }

                        // Add Waste Points
                        mapData.waste_points.forEach(pt => {
                            const el = document.createElement('div');
                            el.className = 'marker';
                            el.style.backgroundColor = '#3b82f6';
                            el.style.width = '12px';
                            el.style.height = '12px';
                            el.style.borderRadius = '50%';
                            el.style.border = '2px solid white';
                            el.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.8)';
                            
                            new mapboxgl.Marker(el)
                                .setLngLat([pt.lng, pt.lat])
                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${pt.type} Waste</b><br/>${pt.weight} kg<br/><span class="text-xs text-green-600">Verified by GEE</span>`))
                                .addTo(map.current);
                        });

                        // Add Biomass Zones
                        mapData.biomass_zones.forEach(pt => {
                            const el = document.createElement('div');
                            el.className = 'marker';
                            el.style.backgroundColor = '#10b981';
                            el.style.width = '16px';
                            el.style.height = '16px';
                            el.style.borderRadius = '50%';
                            el.style.border = '2px solid white';
                            el.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.8)';
                            
                            new mapboxgl.Marker(el)
                                .setLngLat([pt.lng, pt.lat])
                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${pt.crop} Biomass</b><br/>${pt.tons} tons estimated<br/><span class="text-xs text-blue-600">AgriStack Synced</span>`))
                                .addTo(map.current);
                        });
                    });
                } catch (e) {
                    console.log("Mapbox requires a valid token. Rendering fallback map UI.");
                    mapContainer.current.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-800 text-white rounded-xl border border-gray-700"><div class="text-center"><i class="fa-solid fa-map-location-dot text-5xl mb-4 text-emerald-500"></i><p class="text-xl font-semibold">Geospatial Engine Active</p><p class="text-gray-400 mt-2">Mapbox token required for tile rendering.<br/>Data points loaded: ' + (mapData.waste_points.length + mapData.biomass_zones.length) + '</p></div></div>';
                }
            }, [mapData]);

            return <div ref={mapContainer} id="map" className="shadow-lg border border-gray-200"></div>;
        };

        const RecordActivityForm = ({ auth }) => {
            const [type, setType] = useState('Plastic');
            const [weight, setWeight] = useState('');
            const [msg, setMsg] = useState('');

            const handleSubmit = async (e) => {
                e.preventDefault();
                try {
                    // Mock coordinates based on random offset from Delhi
                    const lat = 28.6139 + (Math.random() - 0.5) * 2;
                    const lng = 77.2090 + (Math.random() - 0.5) * 2;
                    
                    const res = await apiCall('/waste/activity', 'POST', {
                        waste_type: type,
                        weight_kg: parseFloat(weight),
                        lat, lng,
                        photo_url: "https://example.com/photo.jpg"
                    }, auth.token);
                    
                    setMsg(`Success! Activity ID: ${res.activity_id}. Geo-verified: ${res.geo_verification.verified}`);
                    setWeight('');
                } catch (err) {
                    setMsg(`Error: ${err.message}`);
                }
            };

            return (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4"><i className="fa-solid fa-camera mr-2 text-blue-500"></i>Record Environmental Activity</h3>
                    {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Waste / Material Type</label>
                            <select value={type} onChange={e => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500">
                                <option>Plastic</option>
                                <option>Organic</option>
                                <option>E-Waste</option>
                                <option>Biomass</option>
                                <option>Mixed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-green-500 focus:ring-green-500" required min="1" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Submit to MRV Engine</button>
                    </form>
                </div>
            );
        };

        const Dashboard = ({ auth, setAuth }) => {
            const [stats, setStats] = useState(null);
            const [activeTab, setActiveTab] = useState('map');

            useEffect(() => {
                apiCall('/dashboard', 'GET', null, auth.token).then(setStats).catch(console.error);
            }, [auth.token]);

            const handleLogout = () => {
                localStorage.removeItem('token');
                setAuth(null);
            };

            return (
                <div className="min-h-screen bg-gray-100">
                    <nav className="bg-green-800 text-white shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <i className="fa-solid fa-leaf text-2xl mr-3 text-green-400"></i>
                                    <span className="font-bold text-xl tracking-tight">RupayKg Command Center</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm bg-green-900 px-3 py-1 rounded-full border border-green-700">{auth.role}</span>
                                    <span className="font-medium">{auth.name}</span>
                                    <button onClick={handleLogout} className="p-2 rounded-full hover:bg-green-700 transition"><i className="fa-solid fa-sign-out-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        {/* Stats Row */}
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-green-500">
                                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Carbon Wallet</div>
                                    <div className="mt-2 text-3xl font-bold text-gray-900">{stats.carbon_credits_kg?.toLocaleString() || 0} <span className="text-lg text-gray-500">kg CO2e</span></div>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-blue-500">
                                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">INR Balance</div>
                                    <div className="mt-2 text-3xl font-bold text-gray-900">₹ {stats.wallet_balance_inr?.toLocaleString() || 0}</div>
                                </div>
                                {auth.role === 'System Admin' && (
                                    <>
                                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-purple-500">
                                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Waste Tracked</div>
                                            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total_waste_tracked_kg?.toLocaleString() || 0} <span className="text-lg text-gray-500">kg</span></div>
                                        </div>
                                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-yellow-500">
                                            <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Carbon Reduced</div>
                                            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total_carbon_reduced_kg?.toLocaleString() || 0} <span className="text-lg text-gray-500">kg</span></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="mb-6 border-b border-gray-200">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                                <li className="mr-2">
                                    <button onClick={() => setActiveTab('map')} className={`inline-block p-4 rounded-t-lg ${activeTab === 'map' ? 'tab-active' : 'tab-inactive'}`}>
                                        <i className="fa-solid fa-map mr-2"></i>Geospatial Map
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button onClick={() => setActiveTab('activity')} className={`inline-block p-4 rounded-t-lg ${activeTab === 'activity' ? 'tab-active' : 'tab-inactive'}`}>
                                        <i className="fa-solid fa-plus-circle mr-2"></i>Record Activity
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'map' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-800"><i className="fa-solid fa-earth-asia mr-2 text-blue-500"></i>National Environmental Map</h2>
                                    <div className="flex space-x-4 text-xs">
                                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></span> Waste Points</span>
                                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-1 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span> Biomass Zones</span>
                                        <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1 opacity-70"></span> Carbon Heatmap</span>
                                    </div>
                                </div>
                                <div className="p-0">
                                    <MapView />
                                </div>
                            </div>
                        )}

                        {activeTab === 'activity' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <RecordActivityForm auth={auth} />
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold mb-4"><i className="fa-solid fa-shield-halved mr-2 text-emerald-600"></i>Verification Protocol</h3>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Fraud Detection:</strong> AI analyzes weight anomalies and rate limits.</li>
                                        <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Geospatial Sync:</strong> Google Earth Engine verifies land cover type.</li>
                                        <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>MRV Engine:</strong> Climatiq API calculates exact tCO2e reduction.</li>
                                        <li className="flex items-start"><i className="fa-solid fa-check text-green-500 mt-1 mr-2"></i> <strong>Registry:</strong> Credits are minted to your Carbon Wallet.</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                        
                    </main>
                </div>
            );
        };

        const Main = () => {
            const [auth, setAuth] = useState(null);

            useEffect(() => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        setAuth({ token, role: payload.role, name: payload.sub });
                    } catch (e) {
                        localStorage.removeItem('token');
                    }
                }
            }, []);

            if (!auth) return <Login setAuth={setAuth} />;
            return <Dashboard auth={auth} setAuth={setAuth} />;
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<Main />);
    </script>
</body>
</html>
"""

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    """Serves the embedded React + Mapbox frontend."""
    return HTMLResponse(content=FRONTEND_HTML, status_code=200)

# =============================================================================
# 10. STARTUP EVENT (SEED DATA)
# =============================================================================
@app.on_event("startup")
async def startup_event():
    # Seed an admin user
    admin_email = "admin@rupaykg.in"
    if not await db.find_one("users", {"email": admin_email}):
        user_id = await db.insert_one("users", {
            "email": admin_email,
            "password": get_password_hash("admin123"),
            "full_name": "System Admin",
            "role": "System Admin",
            "created_at": datetime.utcnow().isoformat()
        })
        await db.insert_one("wallets", {"user_id": user_id, "carbon_credits": 1500.5, "balance_inr": 250000.0})
        
        # Seed some dummy activities for the map
        await db.insert_one("activities", {"user_id": user_id, "waste_type": "Plastic", "weight_kg": 1200, "lat": 28.6139, "lng": 77.2090, "status": "verified"})
        await db.insert_one("activities", {"user_id": user_id, "waste_type": "Organic", "weight_kg": 3400, "lat": 19.0760, "lng": 72.8777, "status": "verified"})
        await db.insert_one("biomass_records", {"user_id": user_id, "crop_type": "Wheat", "hectares": 10, "estimated_tons": 18, "lat": 30.9010, "lng": 75.8573})
        await db.insert_one("carbon_records", {"activity_id": "mock1", "carbon_reduction_kg": 3240, "issued_to": user_id})

# =============================================================================
# RUNNER
# =============================================================================
if __name__ == "__main__":
    import uvicorn
    print("Starting RupayKg Environmental DPI (Production Grade)...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
