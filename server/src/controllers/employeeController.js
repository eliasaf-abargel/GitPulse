// Desc: Controller for employee routes /src/controllers/employeeController.js
const Employee = require('../models/employee');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// Add more controller methods as needed
