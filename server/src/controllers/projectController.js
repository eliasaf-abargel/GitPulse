// Desc: Dashboard controller /src/controllers/projectController.js

const Project = require('../models/project');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('employees');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Add more controller methods as needed
