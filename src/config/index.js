require('dotenv').config();

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/iot_project',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // Houses Server
  HOUSES_SERVER_URL: process.env.HOUSES_SERVER_URL || 'http://localhost:4000/api/internal',
  HOUSES_SERVER_API_KEY: process.env.HOUSES_SERVER_API_KEY || '',
};
