const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const config = require('./config');
const routes = require('./routes');
const { errorMiddleware, notFoundMiddleware } = require('./middlewares/errorMiddleware');

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

// API Routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UI Backend API is running',
    version: '1.0.0',
    documentation: '/api/v1/health',
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
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Đóng server và thoát
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;
