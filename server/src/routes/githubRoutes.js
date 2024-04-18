// src/routes/githubRoutes.js
const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/user-analytics', githubController.getUserAnalytics);

module.exports = router;
