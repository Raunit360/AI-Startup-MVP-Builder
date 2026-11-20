const mongoose = require('mongoose');

// Register Mongoose connection event listeners once
mongoose.connection.on('connected', () => {
  console.log(`[Database] Mongoose connected to database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose disconnected from MongoDB.');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('[Database] Mongoose connection closed due to app termination (SIGINT).');
    process.exit(0);
  } catch (err) {
    console.error('[Database] Error closing Mongoose connection:', err);
    process.exit(1);
  }
});

/**
 * Connect to MongoDB with automated retry logic
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} retryDelayMs - Delay between retries in milliseconds
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async (maxRetries = 5, retryDelayMs = 5000) => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[Database Error] MONGO_URI is not defined in environment variables.');
    throw new Error('MONGO_URI is not defined');
  }

  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      console.log(`[Database] Attempting MongoDB connection (attempt ${attempt}/${maxRetries})...`);
      const conn = await mongoose.connect(uri, options);
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Connection attempt ${attempt} failed: ${error.message}`);
      if (attempt >= maxRetries) {
        console.error('[Database] Maximum retry attempts reached. Could not connect to MongoDB.');
        throw error;
      }
      console.log(`[Database] Retrying in ${retryDelayMs / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
};

module.exports = connectDB;
