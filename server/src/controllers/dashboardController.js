// src/controllers/dashboardController.js
const mongodbService = require('../services/mongodbService');

const getDashboardData = async (req, res) => {
  try {
    const organizations = await mongodbService.getOrganizations();
    const users = await mongodbService.getUsers();
    const repositories = await mongodbService.getRepositories();
    const teams = await mongodbService.getTeams();

    res.json({
      organizations,
      users,
      repositories,
      teams,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getDashboardData,
};