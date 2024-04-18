// src/models/organization.js
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  avatarUrl: String,
});

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;