// src/app.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mongodbService = require('./services/mongodbService');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', authRoutes.router);
app.use('/api/github', githubRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);
app.use('/api/users', authMiddleware, userRoutes);

// API Routes
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB and start the server
mongodbService.connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

module.exports = app;