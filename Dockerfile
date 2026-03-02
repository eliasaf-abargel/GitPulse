# Use Node 20 to satisfy package engine requirements.
FROM node:20

# Install runtime/build dependencies.
RUN apt-get update && apt-get install -y \
    libglib2.0-dev \
    libpcre3-dev \
    zlib1g-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# npm registry/auth args (supports new token and legacy pass fallback).
ARG NPM_REGISTRY_URL=https://registry.npmjs.org
ARG NPM_AUTH_TOKEN
ARG NPM_USER
ARG NPM_PASS
RUN npm config set registry "$NPM_REGISTRY_URL" && \
    REG_HOST="$(echo "$NPM_REGISTRY_URL" | sed -E 's#^https?://##; s#/$##')" && \
    TOKEN="${NPM_AUTH_TOKEN:-$NPM_PASS}" && \
    if [ -n "$TOKEN" ]; then \
      echo "//${REG_HOST}/:_authToken=${TOKEN}" >> /root/.npmrc && \
      echo "//${REG_HOST}/:always-auth=true" >> /root/.npmrc; \
    fi

# Install dependencies with lockfile-first strategy.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port your application is running on
EXPOSE 4000

# Define the healthcheck
HEALTHCHECK CMD curl --fail http://localhost:4000/health || exit 1

# Start the application
CMD ["npm", "start"]
