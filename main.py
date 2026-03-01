# ==========================================
# RUPAYKG BIOMASS EXCHANGE – UNIFIED MODEL
# Full Stack Backend (AI Studio Ready)
# ==========================================

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, List
from jose import jwt, JWTError
from passlib.context import CryptContext
from pymongo import MongoClient
import os
import uuid
import math

# ================= CONFIG =================

SECRET_KEY = os.getenv("SECRET_KEY", "rupaykg_secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["rupaykg_biomass"]

users_col = db["users"]
farmers_col = db["farmers"]
events_col = db["biomass_events"]
dispatch_col = db["dispatches"]
audit_col = db["audit_logs"]

app = FastAPI(title="RupayKg Biomass Exchange API")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# ================= AUTH =================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= MODELS =================

class RegisterUser(BaseModel):
    email: str
    password: str
    role: str

class LoginUser(BaseModel):
    email: str
    password: str

class FarmerCreate(BaseModel):
    name: str
    mobile: str
    land_area: float
    crop_type: str
    latitude: float
    longitude: float

class BiomassEventCreate(BaseModel):
    farmer_id: str
    acreage: float
    estimated_tonnes: float
    latitude: float
    longitude: float

class DispatchCreate(BaseModel):
    aggregator_id: str
    buyer_id: str
    total_tonnes: float

# ================= UTILITIES =================

def log_audit(action, actor):
    audit_col.insert_one({
        "action": action,
        "actor": actor,
        "timestamp": datetime.utcnow()
    })

def calculate_carbon(tonnes):
    # Placeholder: 1 tonne biomass = 1.5 tCO2e avoided
    return round(tonnes * 1.5, 2)

def anomaly_score(acreage, tonnes):
    # Basic rule-based anomaly detection
    expected = acreage * 2.5
    diff = abs(expected - tonnes)
    score = diff / expected if expected > 0 else 0
    return round(score, 2)

# ================= ROUTES =================

@app.get("/api/status")
def status():
    return {"status": "RupayKg Biomass Exchange Running"}

# -------- AUTH --------

@app.post("/register")
def register(user: RegisterUser):
    hashed = pwd_context.hash(user.password)
    users_col.insert_one({
        "email": user.email,
        "password": hashed,
        "role": user.role
    })
    return {"message": "User registered"}

@app.post("/login")
def login(user: LoginUser):
    db_user = users_col.find_one({"email": user.email})
    if not db_user or not pwd_context.verify(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": db_user["email"],
        "role": db_user["role"]
    })

    return {"access_token": token}

# -------- FARMER --------

@app.post("/api/farmer/create")
def create_farmer(data: FarmerCreate, user=Depends(get_current_user)):
    if user["role"] != "aggregator":
        raise HTTPException(status_code=403, detail="Only aggregator allowed")

    farmer_id = str(uuid.uuid4())
    farmers_col.insert_one({
        "farmer_id": farmer_id,
        "name": data.name,
        "mobile": data.mobile,
        "land_area": data.land_area,
        "crop_type": data.crop_type,
        "geo_location": {
            "lat": data.latitude,
            "lng": data.longitude
        },
        "created_at": datetime.utcnow()
    })

    log_audit("Farmer Created", user["sub"])
    return {"farmer_id": farmer_id}

# -------- BIOMASS EVENT --------

@app.post("/api/biomass/event")
def create_event(data: BiomassEventCreate, user=Depends(get_current_user)):
    if user["role"] != "aggregator":
        raise HTTPException(status_code=403, detail="Only aggregator allowed")

    event_id = str(uuid.uuid4())
    carbon = calculate_carbon(data.estimated_tonnes)
    risk = anomaly_score(data.acreage, data.estimated_tonnes)

    events_col.insert_one({
        "event_id": event_id,
        "farmer_id": data.farmer_id,
        "aggregator_id": user["sub"],
        "acreage": data.acreage,
        "estimated_tonnes": data.estimated_tonnes,
        "geo_tag": {
            "lat": data.latitude,
            "lng": data.longitude
        },
        "carbon_estimate": carbon,
        "ai_risk_score": risk,
        "status": "collected",
        "created_at": datetime.utcnow()
    })

    log_audit("Biomass Event Created", user["sub"])

    return {
        "event_id": event_id,
        "carbon_estimate": carbon,
        "risk_score": risk
    }

# -------- DISPATCH --------

@app.post("/api/dispatch")
def create_dispatch(data: DispatchCreate, user=Depends(get_current_user)):
    if user["role"] != "aggregator":
        raise HTTPException(status_code=403, detail="Only aggregator allowed")

    dispatch_id = str(uuid.uuid4())

    dispatch_col.insert_one({
        "dispatch_id": dispatch_id,
        "aggregator_id": data.aggregator_id,
        "buyer_id": data.buyer_id,
        "total_tonnes": data.total_tonnes,
        "created_at": datetime.utcnow()
    })

    log_audit("Dispatch Created", user["sub"])

    return {"dispatch_id": dispatch_id}

# -------- KPI DASHBOARD --------

@app.get("/api/dashboard/kpi")
def kpi_dashboard(user=Depends(get_current_user)):
    if user["role"] not in ["admin", "aggregator"]:
        raise HTTPException(status_code=403, detail="Access denied")

    total_farmers = farmers_col.count_documents({})
    total_events = events_col.count_documents({})
    total_tonnes = sum(e["estimated_tonnes"] for e in events_col.find())
    total_carbon = sum(e["carbon_estimate"] for e in events_col.find())

    return {
        "total_farmers": total_farmers,
        "total_events": total_events,
        "total_biomass_tonnes": total_tonnes,
        "total_carbon_estimate": total_carbon
    }

# -------- AUDIT LOG --------

@app.get("/api/admin/audit")
def audit_logs(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    logs = list(audit_col.find({}, {"_id": 0}))
    return logs
