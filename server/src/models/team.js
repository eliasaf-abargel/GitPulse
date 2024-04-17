// server/src/models/team.js
const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  organization: { type: String, required: true },
  // Add more fields as needed
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;