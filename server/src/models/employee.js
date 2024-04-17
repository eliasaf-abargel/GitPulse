// server/src/models/employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
