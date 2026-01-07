const swaggerJsdoc = require('swagger-jsdoc');
const config = require('./index');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT UI Backend API',
      version: '2.1.0',
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
        url: 'https://iot-project-i0p1.onrender.com/api/v1',
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
        Device: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '65a1b2c3d4e5f6g7h8i9j0k1',
            },
            hardware_id: {
              type: 'string',
              example: 'esp32-27',
            },
            name: {
              type: 'string',
              example: 'Smart Garden Device',
            },
            type: {
              type: 'string',
              example: 'Sensor',
            },
            pump_mode: {
              type: 'string',
              enum: ['ON', 'OFF', 'AUTO'],
              example: 'OFF',
              description: 'Trạng thái pump hiện tại. AUTO = ESP32 tự kiểm soát dựa trên ngưỡng độ ẩm',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        UserDeviceManagement: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '65a1b2c3d4e5f6g7h8i9j0k2',
            },
            user: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            device: {
              type: 'string',
              example: '65a1b2c3d4e5f6g7h8i9j0k1',
            },
            role: {
              type: 'string',
              enum: ['owner', 'member'],
              example: 'owner',
            },
            alias_name: {
              type: 'string',
              example: 'Vườn rau nhà tôi',
            },
            notifications: {
              type: 'object',
              properties: {
                enable_email: {
                  type: 'boolean',
                  example: true,
                },
                enable_push: {
                  type: 'boolean',
                  example: false,
                },
              },
            },
            alert_settings: {
              type: 'object',
              properties: {
                max_temp: {
                  type: 'number',
                  example: 35,
                },
                min_temp: {
                  type: 'number',
                  example: 15,
                },
                min_humidity: {
                  type: 'number',
                  example: 40,
                },
                max_humidity: {
                  type: 'number',
                  example: 80,
                },
                min_soil_moisture: {
                  type: 'number',
                  example: 20,
                },
                min_light: {
                  type: 'number',
                  example: 200,
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SensorData: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '695265647b645bbe408d494c',
            },
            sensorId: {
              type: 'string',
              example: 'esp32-27',
            },
            temp: {
              type: 'number',
              example: 28.5,
              description: 'Nhiệt độ (°C)',
            },
            humidity: {
              type: 'number',
              example: 65,
              description: 'Độ ẩm không khí (%)',
            },
            soil_moisture: {
              type: 'number',
              example: 45,
              description: 'Độ ẩm đất (%)',
            },
            light: {
              type: 'number',
              example: 450,
              description: 'Cường độ ánh sáng (lux)',
            },
            pump_status: {
              type: 'string',
              example: 'OFF',
              description: 'Trạng thái bơm',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T15:30:00.000Z',
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
