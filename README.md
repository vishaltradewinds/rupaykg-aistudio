# RupayKg - Sovereign Environmental DPI (The Google Maps of Waste and Carbon)

RupayKg is a **Waste-to-Carbon Digital MRV Infrastructure Platform**. It acts as a national protocol layer (DPI) that records real-world environmental activity and converts it into verified climate value (carbon credits, recycling credits). It provides a real-time geospatial visualization system similar to Google Maps, but for waste, biomass, recycling, and carbon emissions reduction.

## Architecture & Tech Stack

*   **Backend:** Python FastAPI microservices (Production) & Node.js/Express (Live Preview)
*   **Frontend:** React + Tailwind CSS + Mapbox/Leaflet (Vite)
*   **Database:** MongoDB Atlas
*   **Caching:** Redis
*   **Event Streaming:** Kafka
*   **Authentication:** JWT Role-based access
*   **Cloud & Deployment:** Docker containers, Kubernetes (K8s), Vercel (Frontend), Railway (Backend)

## 12 Strategic API Integrations

The platform integrates the following 12 strategic APIs to power its geospatial and MRV engines:
1.  **Google Earth Engine API:** Satellite imagery analysis for crop residues and land cover.
2.  **Sentinel Satellite APIs (ESA):** Vegetation monitoring, fire detection, and environmental verification.
3.  **AgriStack APIs:** Farmer registry, crop registry, and land parcel data for biomass estimation.
4.  **Agricultural Data Exchange (ADeX):** Soil data, crop production, and weather patterns.
5.  **OpenWeather API:** Weather data to model composting conditions and biomass drying.
6.  **Climatiq API:** Emission factors to calculate carbon reductions.
7.  **OpenStreetMap API:** Geospatial data for roads, land use, and facility mapping.
8.  **Mapbox API:** Interactive maps, routing, and geolocation visualization.
9.  **ONDC API:** Marketplace creation for trading recyclables and biomass.
10. **OpenGHG API:** Greenhouse gas datasets for emissions analysis.
11. **Energy and Biomass Datasets API:** Mapping biomass power plants and waste-to-energy plants.
12. **Aadhaar Identity APIs:** Identity verification for aggregators and recyclers to prevent fraud.

## Database Structure (MongoDB)

*   `users`: `{ _id, name, phone, role, organization, state, wallet_balance, created_at }`
*   `activities`: `{ _id, user_id, waste_type, weight_kg, lat, lng, photo_url, status, timestamp }`
*   `biomass_records`: `{ _id, farmer_id, crop_type, hectares, estimated_tons, status }`
*   `carbon_records`: `{ _id, activity_id, carbon_reduction_kg, verified_by, status }`
*   `wallets`: `{ _id, user_id, balance_inr, carbon_credits, transactions: [] }`
*   `projects`: `{ _id, name, type, location, capacity, status }`
*   `marketplace_listings`: `{ _id, material, quantity, price, location, listed_by, status }`
*   `audit_logs`: `{ _id, action, user_id, timestamp, details, ip_address }`

## API Design & Documentation

### Authentication
*   `POST /auth/register` - Register a new user (Generator, Aggregator, Recycler, Municipality, Carbon Admin, Corporate Buyer, System Admin)
*   `POST /auth/login` - Authenticate and receive JWT

### Waste Activity Engine
*   `POST /waste/activity` - Record waste generation (requires GPS & photo)
*   `GET /waste/history` - Get user's activity history

### Biomass Supply Chain
*   `POST /biomass/estimate` - Estimate biomass based on crop type and hectares (Rice: 2.5, Wheat: 1.8, Maize: 2.0)

### MRV Engine & Carbon Registry
*   `POST /mrv/verify` - Verify an activity and calculate emission reduction (Biomass: 1.5, Plastic: 2.7, Organic: 0.9)
*   `POST /carbon/register` - Submit verified environmental activity to carbon registries

### Marketplace & Geospatial
*   `POST /marketplace/list` - Push a listing to the ONDC network
*   `GET /map/environmental-activity` - Fetch geospatial data for map visualization
*   `GET /dashboard` - Fetch role-specific metrics

## Deployment Instructions

### Single-File Prototype (Fastest Setup)
We have generated a complete production-grade platform in a single file (`rupaykg_core.py`) with an embedded React frontend and all 12 API connectors.
1. Install dependencies: `pip install -r requirements_single.txt`
2. Run the server: `uvicorn rupaykg_core:app --reload`
3. View the dashboard at `http://localhost:8000`

### Local Development (Full Python Backend)
1.  Navigate to the Python backend directory: `cd rupaykg-dpi-python`
2.  Install dependencies: `pip install -r requirements.txt`
3.  Run the server: `uvicorn main:app --reload`
4.  Access the interactive API docs at: `http://localhost:8000/docs`

### Docker Deployment
1.  Run `docker-compose up --build -d` to start the API, MongoDB, Redis, and Kafka containers.

### Kubernetes Deployment (National Scale)
1.  Apply the deployment manifest: `kubectl apply -f rupaykg-dpi-python/k8s/deployment.yaml`
2.  Ensure your cluster has ingress controllers configured for load balancing.

### Frontend Deployment (Vercel)
1.  The React frontend in `/src` is ready to be deployed to Vercel.
2.  Run `npm run build` to generate the static files.
3.  Deploy the `/dist` folder. Ensure `VITE_API_URL` is set in your Vercel environment variables.
