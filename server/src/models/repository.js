const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  htmlUrl: String,
  organization: { type: String, required: true },
  // Add more fields as needed
});

const Repository = mongoose.model('Repository', repositorySchema);

module.exports = Repository;