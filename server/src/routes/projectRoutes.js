// server/src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('~/controllers/projectController');

router.get('/', projectController.getProjects);
// Add more routes as needed

module.exports = router;