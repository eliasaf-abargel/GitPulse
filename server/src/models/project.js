// server/src/models/project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String,
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
});

module.exports = mongoose.model('Project', projectSchema);
