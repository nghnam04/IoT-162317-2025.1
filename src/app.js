const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const config = require('./config');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/errorMiddleware');
const cronService = require('./services/cronService');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// ===========================
// MIDDLEWARES
// ===========================

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Cho phép tất cả origins (nên giới hạn trong production)
  credentials: true,
}));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (config.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ===========================
// ROUTES
// ===========================

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'IoT UI Backend API Docs',
}));

// API Routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UI Backend API is running',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/v1/health',
  });
});

// ===========================
// ERROR HANDLING
// ===========================

// 404 Not Found Handler
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

// ===========================
// START SERVER
// ===========================

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 UI Backend Server is running`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`📡 API Base: http://localhost:${PORT}/api/v1`);
  console.log(`🏠 Houses Server: ${config.HOUSES_SERVER_URL}`);
  console.log('='.repeat(50));
  
  // Initialize Cron Jobs
  cronService.initializeCronJobs();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Stop cron jobs before exit
  cronService.stopAllCronJobs();
  // Đóng server và thoát
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Stop cron jobs before exit
  cronService.stopAllCronJobs();
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  cronService.stopAllCronJobs();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  cronService.stopAllCronJobs();
  process.exit(0);
});

module.exports = app;
