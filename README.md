# RupayKg - Sovereign Environmental DPI

RupayKg is a **Waste-to-Carbon Digital MRV Infrastructure Platform**. It acts as a national protocol layer (DPI) that records real-world environmental activity and converts it into verified climate value (carbon credits, recycling credits).

## Architecture

*   **Backend:** Python FastAPI microservices
*   **Frontend:** React + Tailwind CSS (Vite)
*   **Database:** MongoDB Atlas
*   **Caching:** Redis
*   **Event Streaming:** Kafka
*   **Cloud:** Docker & Kubernetes

## Directory Structure

*   `/rupaykg-dpi-python`: Contains the complete Python FastAPI backend, Dockerfile, Docker Compose, and Kubernetes manifests.
*   `/src`: Contains the complete React + Tailwind frontend dashboard.
*   `/server.ts`: Contains the Node.js/Express fallback backend used for the live preview environment.

## Database Schema (MongoDB)

*   `users`: `{ _id, name, phone, role, organization, state, wallet_balance, created_at }`
*   `activities`: `{ _id, user_id, waste_type, weight_kg, lat, lng, photo_url, status, timestamp }`
*   `biomass_records`: `{ _id, farmer_id, crop_type, hectares, estimated_tons, status }`
*   `carbon_records`: `{ _id, activity_id, carbon_reduction_kg, verified_by, status }`
*   `wallets`: `{ _id, user_id, balance_inr, carbon_credits, transactions: [] }`
*   `marketplace_listings`: `{ _id, material, quantity, price, location, listed_by, status }`

## API Documentation

### Authentication
*   `POST /auth/register` - Register a new user (Generator, Aggregator, etc.)
*   `POST /auth/login` - Authenticate and receive JWT

### Waste Activity Engine
*   `POST /waste/activity` - Record waste generation (requires GPS & photo)
*   `GET /waste/history` - Get user's activity history

### Biomass Supply Chain
*   `POST /biomass/estimate` - Estimate biomass based on crop type and hectares (Rice: 2.5, Wheat: 1.8, Maize: 2.0)

### MRV Engine
*   `POST /mrv/verify` - Verify an activity and calculate emission reduction (Biomass: 1.5, Plastic: 2.7, Organic: 0.9)

### DPI Integrations
*   `GET /integrations/agristack/{farmer_id}` - Fetch farmer data from AgriStack
*   `POST /marketplace/list` - Push a listing to the ONDC network

## Deployment Instructions

### Local Development (Python Backend)
1.  Navigate to the Python backend directory: `cd rupaykg-dpi-python`
2.  Install dependencies: `pip install -r requirements.txt`
3.  Run the server: `uvicorn main:app --reload`
4.  Access the interactive API docs at: `http://localhost:8000/docs`

### Docker Deployment
1.  Run `docker-compose up --build -d` to start the API, MongoDB, and Redis containers.

### Kubernetes Deployment
1.  Apply the deployment manifest: `kubectl apply -f rupaykg-dpi-python/k8s/deployment.yaml`

### Frontend Deployment (Vercel)
1.  The React frontend in `/src` is ready to be deployed to Vercel.
2.  Run `npm run build` to generate the static files.
3.  Deploy the `/dist` folder.
