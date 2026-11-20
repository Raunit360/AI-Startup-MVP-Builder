
const mongoose = require('mongoose');

mongoose.connection.on('connected', () => {
  console.log(`[Database] Connected: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`[Database] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Disconnected from MongoDB.');
});

// Reuse the connection promise across requests in a warm instance.
let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  connectionPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 5,
  });

  try {
    await connectionPromise;
    console.log('[Database] MongoDB connected successfully.');
    return mongoose;
  } catch (error) {
    connectionPromise = null;
    console.error(`[Database] MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
