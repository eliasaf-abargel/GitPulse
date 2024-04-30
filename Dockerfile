# Use a base image
FROM node:14

# Install GELF logging driver dependencies
RUN apt-get update && apt-get install -y \
    libglib2.0-dev \
    libpcre3-dev \
    zlib1g-dev \
    libsystemd-dev

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
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