
FROM node:24-bookworm-slim

WORKDIR /app

# Install dependencies needed if better-sqlite3
# must compile a native binary
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       make \
       g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy npm workspace manifests
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

RUN npm ci --omit=dev

# Copy backend source
COPY server/ ./server/

# Create persistent database directory
RUN mkdir -p /app/server/data \
    && chown -R node:node /app

USER node

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/app/server/data/users.sqlite

EXPOSE 3001

CMD ["node", "server/src/index.js"]
