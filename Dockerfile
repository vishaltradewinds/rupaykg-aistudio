FROM node:22-slim

WORKDIR /app

# Install the locked dependency graph needed for the production build.
COPY package.json package-lock.json ./
RUN npm ci

# Build the Vite frontend and bundled Express server from the same source tree.
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV APP_MODE=production
ENV PORT=3000

# The current Express entry point binds to port 3000.
# Cloud Run can target this explicit container port; PORT handling should be
# revisited before changing the runtime port contract.
EXPOSE 3000

CMD ["npm", "start"]
