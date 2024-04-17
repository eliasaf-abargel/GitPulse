// server/src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: String,
  avatarUrl: String,
  company: String,
  location: String,
  // Add more fields as needed
});

const User = mongoose.model('User', userSchema);

module.exports = User;