const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT UI Backend API',
      version: '1.0.0',
      description: 'API documentation cho hệ thống IoT - UI Backend Service',
      contact: {
        name: 'API Support',
        email: 'support@iot.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://iot-project-i0p1.onrender.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'nguyenvana',
            },
            email: {
              type: 'string',
              example: 'a@gmail.com',
            },
            full_name: {
              type: 'string',
              example: 'Nguyen Van A',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserConfig: {
          type: 'object',
          properties: {
            notifications: {
              type: 'object',
              properties: {
                email_alert: {
                  type: 'boolean',
                  example: true,
                },
                push_alert: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            thresholds: {
              type: 'object',
              properties: {
                max_temp: {
                  type: 'number',
                  example: 35,
                },
                min_humidity: {
                  type: 'number',
                  example: 40,
                },
                max_humidity: {
                  type: 'number',
                  example: 80,
                },
                min_light: {
                  type: 'number',
                  example: 200,
                },
              },
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SensorData: {
          type: 'object',
          properties: {
            temperature: {
              type: 'number',
              example: 28.5,
            },
            humidity: {
              type: 'number',
              example: 65,
            },
            light: {
              type: 'number',
              example: 850,
            },
            pump_status: {
              type: 'string',
              example: 'OFF',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Success message',
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
