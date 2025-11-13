# Use public Node.js image from Docker Hub
FROM node:18

# Install GELF logging driver dependencies (if needed)
# Note: Debian Bullseye (used by node:18) repositories are still active
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

# Configure npm to use JFrog Fly registry
# Build args for npm authentication (optional, if registry requires auth)
ARG NPM_USER
ARG NPM_PASS
ARG NPM_EMAIL
RUN npm config set registry https://infraops.jfrog.io/artifactory/api/npm/npm/ && \
    if [ -n "$NPM_USER" ] && [ -n "$NPM_PASS" ]; then \
      echo "//infraops.jfrog.io/artifactory/api/npm/npm/:_authToken=$NPM_PASS" >> /root/.npmrc && \
      echo "//infraops.jfrog.io/artifactory/api/npm/npm/:always-auth=true" >> /root/.npmrc; \
    fi

# Install dependencies from Fly registry
RUN npm install

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