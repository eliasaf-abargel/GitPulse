FROM node:21.7.3

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon and sequelize-cli globally
RUN npm install -g nodemon sequelize-cli

# Copy the entire project directory
COPY . .

# Build the application
RUN npm run build

# Copy the .env file into the dist folder as needed
COPY .env ./dist/.env

# Expose the port your application listens on
EXPOSE 5001

# Start the application
CMD ["node", "dist/App.js"]
