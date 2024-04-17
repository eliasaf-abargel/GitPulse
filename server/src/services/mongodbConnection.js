// server/src/services/mongodbConnection.js
const mongoose = require('mongoose');
const config = require('../config/config');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = {
  connectToMongoDB,
};