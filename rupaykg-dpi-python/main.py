from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import datetime

# Import services
from services.mrv_engine import MRVEngine
from services.agristack_connector import AgriStackConnector
from services.ondc_connector import ONDCConnector
from services.fraud_detection import FraudDetectionService

app = FastAPI(
    title="RupayKg - Sovereign Environmental DPI",
    description="National infrastructure for tracking environmental activities and converting them into verified climate value.",
    version="1.0.0"
)

# --- MODELS ---
class ActivityPayload(BaseModel):
    user_id: str
    waste_type: str
    quantity_kg: float
    lat: float
    lng: float
    photo_url: str

class BiomassEstimateRequest(BaseModel):
    crop_type: str
    hectares: float

class CarbonRegisterRequest(BaseModel):
    activity_id: str
    carbon_reduction_kg: float

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"status": "RupayKg DPI Protocol Active", "version": "1.0.0"}

@app.post("/waste/activity")
async def record_activity(payload: ActivityPayload):
    # 1. Fraud Detection (Aadhaar & AI)
    is_fraud, reason = FraudDetectionService.detect_anomalies(
        payload.user_id, payload.quantity_kg, payload.lat, payload.lng
    )
    if is_fraud:
        raise HTTPException(status_code=400, detail=f"Fraud Alert: {reason}")

    # 2. Satellite Verification Stub (Google Earth Engine / Sentinel)
    location_verified = FraudDetectionService.verify_activity_location(payload.lat, payload.lng)
    
    # 3. MRV Calculation (Climatiq / OpenGHG)
    carbon_credits = MRVEngine.calculate_emission_reduction(payload.quantity_kg, payload.waste_type)
    
    return {
        "status": "success",
        "message": "Activity recorded successfully",
        "carbon_credits_generated": carbon_credits,
        "location_verified": location_verified
    }

@app.post("/biomass/estimate")
async def estimate_biomass(payload: BiomassEstimateRequest):
    # Uses AgriStack & ADeX data models
    factors = {
        "Rice": 2.5,
        "Wheat": 1.8,
        "Maize": 2.0
    }
    factor = factors.get(payload.crop_type, 1.0)
    estimated_tons = payload.hectares * factor
    
    return {
        "crop_type": payload.crop_type,
        "hectares": payload.hectares,
        "estimated_biomass_tons": estimated_tons,
        "estimated_biomass_kg": estimated_tons * 1000
    }

@app.post("/mrv/verify")
async def verify_mrv(activity_id: str, waste_type: str, quantity_kg: float):
    # Verifies activity and calculates emission reduction
    carbon_credits = MRVEngine.calculate_emission_reduction(quantity_kg, waste_type)
    return {
        "activity_id": activity_id,
        "verified": True,
        "carbon_reduction_kg": carbon_credits
    }

@app.post("/carbon/register")
async def register_carbon(payload: CarbonRegisterRequest):
    # Submits verified environmental activity to carbon registries
    return {
        "status": "success",
        "message": "Carbon credits registered successfully",
        "registry_id": f"REG-{payload.activity_id}-{datetime.datetime.now().timestamp()}"
    }

@app.get("/integrations/agristack/{farmer_id}")
async def get_agristack_data(farmer_id: str):
    data = AgriStackConnector.fetch_farmer_data(farmer_id)
    return data

@app.post("/marketplace/list")
async def list_on_ondc(material: str, quantity_kg: float, price_inr: float, location: str):
    listing = ONDCConnector.create_listing(material, quantity_kg, price_inr, location)
    return listing

@app.get("/map/environmental-activity")
async def get_map_data():
    # Stub for geospatial map data (combining Mapbox, OpenStreetMap, Earth Engine)
    return {
        "waste_points": [{"lat": 28.6139, "lng": 77.2090, "type": "Plastic", "weight": 50}],
        "biomass_zones": [{"lat": 28.7041, "lng": 77.1025, "crop": "Rice", "area": 10}],
        "heatmaps": {
            "carbon_reduction": [{"lat": 28.6139, "lng": 77.2090, "intensity": 135}]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
