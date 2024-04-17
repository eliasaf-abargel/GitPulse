// server/src/app.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dashboardRoutes = require('./routes/dashboardRoutes');
const mongodbService = require('./services/mongodbConnection');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// API Routes
app.use('/api/dashboard', dashboardRoutes);

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