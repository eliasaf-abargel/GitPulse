//src/models/userLogin.js
const mongoose = require('mongoose');

const userLoginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const UserLogin = mongoose.model('UserLogin', userLoginSchema);

module.exports = UserLogin;