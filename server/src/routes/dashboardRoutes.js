// Initiate express router server/src/routes/dashboardRoutes.js
const express = require('express');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

router.get('/', dashboardController.getDashboardData);

module.exports = router;