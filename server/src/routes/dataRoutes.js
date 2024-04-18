// src/routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const mongodbService = require('../services/mongodbService');

// GET /users/github
router.get('/users/github', async (req, res) => {
  try {
    const users = await mongodbService.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching GitHub users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /users/github/:username
router.get('/users/github/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await mongodbService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(`Error fetching GitHub user "${req.params.username}":`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /users/github/email/:email
router.get('/users/github/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await mongodbService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(`Error fetching GitHub user with email "${req.params.email}":`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET /teams/github
router.get('/teams/github', async (req, res) => {
  try {
    const teams = await mongodbService.getTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error fetching GitHub teams:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /repositories/github
router.get('/repositories/github', async (req, res) => {
  try {
    const repositories = await mongodbService.getRepositories();
    res.json(repositories);
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /organizations/github
router.get('/organizations/github', async (req, res) => {
  try {
    const organizations = await mongodbService.getOrganizations();
    res.json(organizations);
  } catch (error) {
    console.error('Error fetching GitHub organizations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /teams/:teamName/users
router.get('/teams/:teamName/users', async (req, res) => {
  try {
    const { teamName } = req.params;
    const users = await mongodbService.getUsersInTeam(teamName);
    res.json(users);
  } catch (error) {
    console.error(`Error fetching users in team "${req.params.teamName}":`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /teams/:teamName/repositories
router.get('/teams/:teamName/repositories', async (req, res) => {
  try {
    const { teamName } = req.params;
    const repositories = await mongodbService.getRepositoriesInTeam(teamName);
    res.json(repositories);
  } catch (error) {
    console.error(`Error fetching repositories in team "${req.params.teamName}":`, error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;