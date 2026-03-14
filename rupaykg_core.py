import os
import time
import json
import asyncio
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt

# ---------------------------------------------------------
# CONFIGURATION & CONSTANTS
# ---------------------------------------------------------
SECRET_KEY = os.getenv("SECRET_KEY", "rupaykg-super-secret-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

# Emission Factors (tCO2e per ton)
EMISSION_FACTORS = {
    "biomass_diversion": 1.5,
    "plastic_recycling": 2.7,
    "organic_composting": 0.9,
    "waste_to_energy": 1.2
}

# Crop Residue Factors (tons per hectare)
CROP_FACTORS = {
    "Rice": 2.5,
    "Wheat": 1.8,
    "Maize": 2.0,
    "Sugarcane": 4.0
}

# ---------------------------------------------------------
# DATABASE & CACHING (MOCKS FOR STANDALONE EXECUTION)
# ---------------------------------------------------------
# In a true production environment, these would use motor.motor_asyncio and redis.asyncio
# For this single-file prototype, we use in-memory dictionaries to ensure it runs instantly anywhere.
class MockDB:
    def __init__(self):
        self.users = {}
        self.activities = {}
        self.biomass_records = {}
        self.carbon_records = {}
        self.wallets = {}
        self.projects = {}
        self.marketplace_listings = {}
        self.audit_logs = []

    def insert(self, collection: str, record: dict) -> str:
        record_id = f"{collection}_{int(time.time() * 1000)}"
        record["_id"] = record_id
        getattr(self, collection)[record_id] = record
        return record_id

    def find(self, collection: str, query: dict = None) -> List[dict]:
        data = getattr(self, collection).values()
        if not query:
            return list(data)
        result = []
        for item in data:
            match = all(item.get(k) == v for k, v in query.items())
            if match:
                result.append(item)
        return result

    def find_one(self, collection: str, query: dict) -> Optional[dict]:
        res = self.find(collection, query)
        return res[0] if res else None

    def update_one(self, collection: str, query: dict, update: dict):
        record = self.find_one(collection, query)
        if record:
            for k, v in update.items():
                record[k] = v
            return True
        return False

db = MockDB()

# ---------------------------------------------------------
# SECURITY & AUTHENTICATION
# ---------------------------------------------------------
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
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.find_one("users", {"email": email})
    if user is None:
        raise credentials_exception
    return user

def require_role(allowed_roles: List[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in allowed_roles and "System Admin" not in allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted for this role")
        return current_user
    return role_checker

# ---------------------------------------------------------
# PYDANTIC MODELS
# ---------------------------------------------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = Field(..., description="Generator, Aggregator, Recycler, Municipality, Carbon Verifier, Corporate Buyer, System Admin")
    aadhaar_id: Optional[str] = None

class ActivityCreate(BaseModel):
    waste_type: str
    weight_kg: float
    lat: float
    lng: float
    photo_url: str

class BiomassEstimate(BaseModel):
    crop_type: str
    hectares: float
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

# ---------------------------------------------------------
# 12 STRATEGIC API CONNECTORS (MOCKED ARCHITECTURE)
# ---------------------------------------------------------
class GoogleEarthEngineAPI:
    @staticmethod
    async def verify_land_cover(lat: float, lng: float) -> dict:
        """Uses GEE to verify if the location is agricultural land or urban waste zone."""
        return {"verified": True, "land_type": "agricultural", "confidence": 0.92}

class SentinelAPI:
    @staticmethod
    async def detect_fire_anomalies(lat: float, lng: float) -> bool:
        """Uses ESA Sentinel data to check for crop burning (stubble burning)."""
        return False # No fire detected, safe for biomass collection

class AgriStackAPI:
    @staticmethod
    async def fetch_farmer_data(aadhaar_id: str) -> dict:
        """Fetches verified farmer registry data."""
        return {"farmer_id": "AGRI-9982", "verified": True, "land_holdings_ha": 4.5}

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
        """Fetches real-time emission factors for MRV."""
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
        """Broadcasts recyclables to the Open Network for Digital Commerce."""
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
        """Sovereign identity verification."""
        return len(str(aadhaar_id)) == 12 if aadhaar_id else False

# ---------------------------------------------------------
# CORE ENGINES
# ---------------------------------------------------------
class FraudDetectionEngine:
    @staticmethod
    async def analyze(user_id: str, weight_kg: float, lat: float, lng: float) -> dict:
        # 1. Impossible quantities check
        if weight_kg > 10000: # > 10 tons in one go is suspicious for a single generator
            return {"is_fraud": True, "reason": "Exceeds maximum physical capacity per transaction"}
        
        # 2. Location anomaly (e.g., claiming ocean coordinates)
        if lat == 0 and lng == 0:
            return {"is_fraud": True, "reason": "Invalid GPS coordinates"}
            
        # 3. Duplicate submission check (mocked)
        recent_activities = db.find("activities", {"user_id": user_id})
        if len(recent_activities) > 50:
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
            "Mixed": "waste_to_energy"
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
        wallet = db.find_one("wallets", {"user_id": user_id})
        if not wallet:
            wallet_id = db.insert("wallets", {"user_id": user_id, "carbon_credits": 0, "balance_inr": 0})
            wallet = db.find_one("wallets", {"_id": wallet_id})
        
        new_balance = wallet["carbon_credits"] + carbon_kg
        db.update_one("wallets", {"user_id": user_id}, {"carbon_credits": new_balance})
        return new_balance

# ---------------------------------------------------------
# FASTAPI APPLICATION INITIALIZATION
# ---------------------------------------------------------
app = FastAPI(
    title="RupayKg - Google Maps of Waste and Carbon",
    description="National Digital Public Infrastructure for Environmental MRV",
    version="2.0.0"
)

# Middleware for Audit Logging
@app.middleware("http")
async def audit_log_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    db.audit_logs.append({
        "method": request.method,
        "url": str(request.url),
        "status_code": response.status_code,
        "process_time_ms": round(process_time * 1000, 2),
        "timestamp": datetime.utcnow().isoformat()
    })
    return response

# ---------------------------------------------------------
# API ROUTES
# ---------------------------------------------------------

@app.post("/auth/register")
async def register(user: UserCreate):
    if db.find_one("users", {"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if user.aadhaar_id and not await AadhaarAPI.verify_identity(user.aadhaar_id):
        raise HTTPException(status_code=400, detail="Invalid Aadhaar Identity")

    user_dict = user.dict()
    user_dict["password"] = get_password_hash(user_dict.pop("password"))
    user_dict["created_at"] = datetime.utcnow().isoformat()
    
    user_id = db.insert("users", user_dict)
    db.insert("wallets", {"user_id": user_id, "carbon_credits": 0.0, "balance_inr": 0.0})
    
    return {"message": "User registered successfully", "user_id": user_id}

@app.post("/auth/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.find_one("users", {"email": form_data.username})
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
    act_id = db.insert("activities", act_dict)
    
    return {"message": "Activity recorded", "activity_id": act_id, "geo_verification": geo_verify}

@app.get("/waste/history")
async def get_history(current_user: dict = Depends(get_current_user)):
    activities = db.find("activities", {"user_id": current_user["_id"]})
    return {"activities": activities}

@app.post("/biomass/estimate")
async def estimate_biomass(data: BiomassEstimate, current_user: dict = Depends(get_current_user)):
    # Integrate AgriStack & ADeX
    yield_factor = await ADeXAPI.fetch_crop_yield("regional", data.crop_type)
    estimated_tons = data.hectares * yield_factor
    
    record_id = db.insert("biomass_records", {
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
    activity = db.find_one("activities", {"_id": data.activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    carbon_reduction_kg = await MRVEngine.calculate(data.waste_type, data.weight_kg)
    
    db.update_one("activities", {"_id": data.activity_id}, {"status": "verified"})
    
    return {"activity_id": data.activity_id, "carbon_reduction_kg": carbon_reduction_kg, "status": "verified"}

@app.post("/carbon/register")
async def register_carbon(data: CarbonRegister, current_user: dict = Depends(require_role(["Carbon Verifier", "System Admin"]))):
    activity = db.find_one("activities", {"_id": data.activity_id})
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
        
    # Issue credits to the original generator
    generator_id = activity["user_id"]
    new_balance = await CarbonRegistry.issue_credits(generator_id, data.carbon_reduction_kg)
    
    record_id = db.insert("carbon_records", {
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
    
    listing_id = db.insert("marketplace_listings", list_dict)
    return {"message": "Listed on RupayKg & ONDC", "listing_id": listing_id, "ondc_txn": ondc_txn}

@app.get("/map/environmental-data")
async def get_map_data():
    activities = db.find("activities")
    biomass = db.find("biomass_records")
    
    waste_points = [{"lat": a["lat"], "lng": a["lng"], "type": a["waste_type"], "weight": a["weight_kg"]} for a in activities if "lat" in a]
    biomass_zones = [{"lat": b["lat"], "lng": b["lng"], "crop": b["crop_type"], "tons": b["estimated_tons"]} for b in biomass if "lat" in b]
    
    # Generate mock heatmap data based on verified activities
    verified = db.find("activities", {"status": "verified"})
    heatmaps = [{"lat": v["lat"], "lng": v["lng"], "intensity": v["weight_kg"] * 1.5} for v in verified if "lat" in v]
    
    # Add some dummy data if empty to ensure the map looks good
    if not waste_points:
        waste_points = [
            {"lat": 28.6139, "lng": 77.2090, "type": "Plastic", "weight": 500},
            {"lat": 19.0760, "lng": 72.8777, "type": "Organic", "weight": 1200}
        ]
        biomass_zones = [
            {"lat": 30.9010, "lng": 75.8573, "crop": "Wheat", "tons": 4500},
            {"lat": 22.9868, "lng": 87.8550, "crop": "Rice", "tons": 3200}
        ]
        heatmaps = [
            {"lat": 28.6139, "lng": 77.2090, "intensity": 750},
            {"lat": 19.0760, "lng": 72.8777, "intensity": 1080}
        ]

    return {
        "waste_points": waste_points,
        "biomass_zones": biomass_zones,
        "heatmaps": heatmaps
    }

@app.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    role = current_user["role"]
    wallet = db.find_one("wallets", {"user_id": current_user["_id"]})
    
    stats = {
        "wallet_balance_inr": wallet["balance_inr"] if wallet else 0,
        "carbon_credits_kg": wallet["carbon_credits"] if wallet else 0,
    }
    
    if role in ["System Admin", "Municipality", "Carbon Verifier"]:
        all_activities = db.find("activities")
        stats["total_waste_tracked_kg"] = sum(a.get("weight_kg", 0) for a in all_activities)
        stats["total_carbon_reduced_kg"] = sum(c.get("carbon_reduction_kg", 0) for c in db.find("carbon_records"))
        stats["active_users"] = len(db.users)
        stats["active_listings"] = len(db.find("marketplace_listings", {"status": "active"}))
    else:
        my_activities = db.find("activities", {"user_id": current_user["_id"]})
        stats["my_waste_submitted_kg"] = sum(a.get("weight_kg", 0) for a in my_activities)
        stats["pending_verifications"] = len([a for a in my_activities if a.get("status") == "pending_verification"])

    return stats

# ---------------------------------------------------------
# EMBEDDED FRONTEND (REACT + MAPBOX + TAILWIND)
# ---------------------------------------------------------
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
        #map { width: 100%; height: 500px; border-radius: 0.75rem; }
        .glass-panel { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); }
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
                            <h1 className="text-3xl font-bold text-green-800"><i className="fa-solid fa-leaf mr-2"></i>RupayKg</h1>
                            <p className="text-gray-500 mt-2">Sovereign Environmental DPI</p>
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
                        zoom: 4
                    });

                    map.current.on('load', () => {
                        // Add Waste Points
                        mapData.waste_points.forEach(pt => {
                            const el = document.createElement('div');
                            el.className = 'marker';
                            el.style.backgroundColor = '#3b82f6';
                            el.style.width = '15px';
                            el.style.height = '15px';
                            el.style.borderRadius = '50%';
                            el.style.border = '2px solid white';
                            
                            new mapboxgl.Marker(el)
                                .setLngLat([pt.lng, pt.lat])
                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${pt.type} Waste</b><br/>${pt.weight} kg`))
                                .addTo(map.current);
                        });

                        // Add Biomass Zones
                        mapData.biomass_zones.forEach(pt => {
                            const el = document.createElement('div');
                            el.className = 'marker';
                            el.style.backgroundColor = '#10b981';
                            el.style.width = '20px';
                            el.style.height = '20px';
                            el.style.borderRadius = '50%';
                            el.style.border = '2px solid white';
                            
                            new mapboxgl.Marker(el)
                                .setLngLat([pt.lng, pt.lat])
                                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<b>${pt.crop} Biomass</b><br/>${pt.tons} tons estimated`))
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

        const Dashboard = ({ auth, setAuth }) => {
            const [stats, setStats] = useState(null);

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

                        {/* Map Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-800"><i className="fa-solid fa-earth-asia mr-2 text-blue-500"></i>Geospatial Environmental Map</h2>
                                <div className="flex space-x-2 text-xs">
                                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span> Waste</span>
                                    <span className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-1"></span> Biomass</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <MapView />
                            </div>
                        </div>
                        
                        {/* Actions Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4"><i className="fa-solid fa-truck-ramp-box mr-2 text-gray-600"></i>Record Activity</h3>
                                <p className="text-sm text-gray-500 mb-4">Log new waste collection or recycling processing.</p>
                                <button className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">Open Scanner</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4"><i className="fa-solid fa-wheat-awn mr-2 text-yellow-600"></i>Biomass Estimate</h3>
                                <p className="text-sm text-gray-500 mb-4">Connect to AgriStack to estimate crop residue.</p>
                                <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition">Fetch Agri Data</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold mb-4"><i className="fa-solid fa-store mr-2 text-purple-600"></i>ONDC Marketplace</h3>
                                <p className="text-sm text-gray-500 mb-4">List verified materials on the national network.</p>
                                <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">Create Listing</button>
                            </div>
                        </div>
                    </main>
                </div>
            );
        };

        const Main = () => {
            const [auth, setAuth] = useState(null);

            // Check local storage on load
            useEffect(() => {
                const token = localStorage.getItem('token');
                if (token) {
                    // In a real app, validate token and fetch user profile. 
                    // For this prototype, we'll just decode the JWT payload manually.
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

# ---------------------------------------------------------
# STARTUP EVENT (SEED DATA)
# ---------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    # Seed an admin user
    admin_email = "admin@rupaykg.in"
    if not db.find_one("users", {"email": admin_email}):
        user_id = db.insert("users", {
            "email": admin_email,
            "password": get_password_hash("admin123"),
            "full_name": "System Admin",
            "role": "System Admin",
            "created_at": datetime.utcnow().isoformat()
        })
        db.insert("wallets", {"user_id": user_id, "carbon_credits": 1500.5, "balance_inr": 250000.0})
        
        # Seed some dummy activities for the map
        db.insert("activities", {"user_id": user_id, "waste_type": "Plastic", "weight_kg": 1200, "lat": 28.6139, "lng": 77.2090, "status": "verified"})
        db.insert("activities", {"user_id": user_id, "waste_type": "Organic", "weight_kg": 3400, "lat": 19.0760, "lng": 72.8777, "status": "verified"})
        db.insert("biomass_records", {"user_id": user_id, "crop_type": "Wheat", "hectares": 10, "estimated_tons": 18, "lat": 30.9010, "lng": 75.8573})
        db.insert("carbon_records", {"activity_id": "mock1", "carbon_reduction_kg": 3240, "issued_to": user_id})

# ---------------------------------------------------------
# RUNNER
# ---------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    # Run the server
    print("Starting RupayKg Environmental DPI...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
