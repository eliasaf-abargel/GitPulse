// src/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String },
  avatarUrl: String,
  company: String,
  location: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;