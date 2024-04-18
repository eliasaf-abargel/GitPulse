// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.delete('/users/:email', authController.deleteUser);

module.exports = {
  router,
};