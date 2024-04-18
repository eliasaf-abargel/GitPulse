// src/config/config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoURI: `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster01.9jdwrvy.mongodb.net/GitDash`,
  githubToken: process.env.GITHUB_TOKEN,
  organizationName: process.env.ORGANIZATION_NAME,
  jwtSecret: process.env.JWT_SECRET,
};