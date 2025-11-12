# Use a base image
FROM gitpulse.jfrog.io/docker/node:14

# Install GELF logging driver dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-dev \
    libpcre3-dev \
    zlib1g-dev

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Configure npm to use JFrog Fly registry
# Build args for npm authentication (optional, if registry requires auth)
ARG NPM_USER
ARG NPM_PASS
ARG NPM_EMAIL
RUN if [ -n "$NPM_USER" ] && [ -n "$NPM_PASS" ]; then \
      npm config set registry https://gitpulse.jfrog.io/artifactory/api/npm/npm/ && \
      npm config set //gitpulse.jfrog.io/artifactory/api/npm/npm/:_authToken "$NPM_PASS" && \
      npm config set //gitpulse.jfrog.io/artifactory/api/npm/npm/:always-auth true; \
    else \
      npm config set registry https://gitpulse.jfrog.io/artifactory/api/npm/npm/; \
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
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost:4000/health || exit 1

# Start the application
CMD ["npm", "start"]