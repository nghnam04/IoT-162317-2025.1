const express = require('express');
const authRoutes = require('./authRoutes');
const monitorRoutes = require('./monitorRoutes');
const controlRoutes = require('./controlRoutes');
const settingsRoutes = require('./settingsRoutes');

const router = express.Router();

/**
 * API Version 1 Routes
 * Base path: /api/v1
 */

// Authentication routes
router.use('/auth', authRoutes);

// Monitoring routes (Proxy đến Houses_server)
router.use('/monitor', monitorRoutes);

// Control routes (Proxy đến Houses_server)
router.use('/control', controlRoutes);

// Settings routes
router.use('/settings', settingsRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UI Backend is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
