// server/src/config/config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGODB_URI,
  githubToken: process.env.GITHUB_TOKEN,
  githubUsername: process.env.GITHUB_USERNAME,
  port: process.env.PORT,
  organizationName: process.env.ORGANIZATION_NAME,
};