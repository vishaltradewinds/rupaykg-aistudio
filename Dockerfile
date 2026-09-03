FROM node:22-slim

WORKDIR /app

# Install production build dependencies from the locked dependency graph.
COPY package.json package-lock.json ./
RUN npm ci

# Copy application source and build the Vite frontend + bundled Express server.
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV APP_MODE=production

# RupayKg's Express server currently binds to port 3000.
EXPOSE 3000

CMD ["npm", "start"]
