# Deployment Scripts

## Single-File Architecture (Fastest Setup)
We have generated a complete production-grade platform in a single file (`rupaykg_core.py`) with an embedded React frontend and all 12 API connectors.
To run this prototype:
```bash
pip install -r requirements_single.txt
uvicorn rupaykg_core:app --reload
```

## Full Microservices Architecture
To deploy the Python backend:
```bash
cd rupaykg-dpi-python
docker-compose up --build -d
```

To deploy the React frontend:
```bash
npm run build
# Deploy the dist folder to Vercel
```
