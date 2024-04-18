// src/config/config.js
const dotenv = require('dotenv');
dotenv.config();

const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster01.9jdwrvy.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

module.exports = {
  mongoURI,
  githubToken: process.env.GITHUB_TOKEN,
  organizationName: process.env.ORGANIZATION_NAME,
  jwtSecret: process.env.JWT_SECRET,
};