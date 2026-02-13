const mongoose = require('mongoose');

/**
 * Mongo connection helper.
 * Uses MONGO_URI from .env (recommended), with a safe local fallback.
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Bank';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err?.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
