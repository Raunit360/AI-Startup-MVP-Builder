require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

// Route imports
const projectRoutes = require('./src/routes/projectRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Middleware imports
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Security HTTP Headers
app.use(helmet());

// 2. CORS configuration
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or in whitelist
      if (!origin || allowedOrigins.includes(origin) || NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from origin ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. Request Logging
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Root Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-Powered Startup MVP Builder API is running',
    version: '1.0.0',
    environment: NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 6. Mount API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 7. Handle 404 for unknown endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

// 8. Centralized Error Handling Middleware
app.use(errorHandler);

// 9. Database Connection & Server Bootstrap
const startServer = async () => {
  try {
    // Connect to MongoDB with retry logic
    await connectDB();

    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 AI Startup MVP Builder Backend running`);
      console.log(`📡 Port:        ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`🔗 Local URL:   http://localhost:${PORT}`);
      console.log(`💻 Frontend:    ${FRONTEND_URL}`);
      console.log(`📜 API Endpoints:`);
      console.log(`   - GET  /`);
      console.log(`   - CRUD /api/projects`);
      console.log(`   - POST /api/projects/:id/generate-plan`);
      console.log(`   - GET  /api/projects/:id/plan`);
      console.log(`   - POST /api/ai/analyze`);
      console.log(`   - GET  /api/dashboard/stats`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error(`[Server Error] Critical error during server startup: ${error.message}`);
    process.exit(1);
  }
};

// Start application
startServer();

module.exports = app;
