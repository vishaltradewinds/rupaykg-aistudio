# Deployment Scripts
This file ensures that the GitHub export registers a new file creation.

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
