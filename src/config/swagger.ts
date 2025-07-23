import swaggerJsdoc from 'swagger-jsdoc';
import { environmentConfig } from './environment';

/**
 * Swagger configuration options
 */
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Operating Room Scheduler API',
      version: '1.0.0',
      description: 'A comprehensive API for managing surgical scheduling in a hospital environment',
      contact: {
        name: 'API Support',
        email: 'support@hospital.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${environmentConfig.getPort()}`,
        description: 'Development server'
      },
      {
        url: `http://localhost:${environmentConfig.getPort()}${environmentConfig.getApiPrefix()}`,
        description: 'API base URL'
      }
    ],
    components: {
      schemas: {
        SurgeryType: {
          type: 'string',
          enum: ['HEART_SURGERY', 'BRAIN_SURGERY'],
          description: 'Type of surgery to be performed'
        },
        Equipment: {
          type: 'string',
          enum: ['MRI', 'CT', 'ECG'],
          description: 'Medical equipment available in operating rooms'
        },
        DoctorType: {
          type: 'string',
          enum: ['HEART_SURGEON', 'BRAIN_SURGEON'],
          description: 'Type of doctor/surgeon'
        },
        ScheduleRequest: {
          type: 'object',
          required: ['doctorId', 'surgeryType'],
          properties: {
            doctorId: {
              type: 'string',
              description: 'Unique identifier for the doctor'
            },
            surgeryType: {
              $ref: '#/components/schemas/SurgeryType'
            }
          }
        },
        ScheduleResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the scheduling was successful'
            },
            data: {
              type: 'object',
              properties: {
                scheduleId: {
                  type: 'string',
                  description: 'Unique identifier for the schedule'
                },
                operatingRoomId: {
                  type: 'integer',
                  description: 'ID of the assigned operating room'
                },
                startTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Start time of the surgery'
                },
                endTime: {
                  type: 'string',
                  format: 'date-time',
                  description: 'End time of the surgery'
                },
                surgeryType: {
                  $ref: '#/components/schemas/SurgeryType'
                }
              }
            },
            error: {
              type: 'string',
              description: 'Error message if scheduling failed'
            },
            message: {
              type: 'string',
              description: 'Additional information about the response'
            }
          }
        },
        OperatingRoomStatus: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Operating room ID'
            },
            equipment: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Equipment'
              },
              description: 'Equipment available in this OR'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the OR is currently active'
            },
            currentSchedule: {
              type: 'object',
              properties: {
                scheduleId: {
                  type: 'string'
                },
                doctorId: {
                  type: 'string'
                },
                surgeryType: {
                  $ref: '#/components/schemas/SurgeryType'
                },
                startTime: {
                  type: 'string',
                  format: 'date-time'
                },
                endTime: {
                  type: 'string',
                  format: 'date-time'
                },
                status: {
                  type: 'string',
                  enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
                }
              }
            },
            nextAvailableTime: {
              type: 'string',
              format: 'date-time',
              description: 'Next available time slot'
            }
          }
        },
        QueueStatusResponse: {
          type: 'object',
          properties: {
            totalItems: {
              type: 'integer',
              description: 'Total number of items in queue'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  position: {
                    type: 'integer',
                    description: 'Position in queue'
                  },
                  doctorId: {
                    type: 'string',
                    description: 'Doctor ID'
                  },
                  surgeryType: {
                    $ref: '#/components/schemas/SurgeryType'
                  },
                  requestTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the request was made'
                  },
                  estimatedWaitTime: {
                    type: 'string',
                    description: 'Estimated wait time'
                  }
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the error occurred'
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request - validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints'
      },
      {
        name: 'Operating Rooms',
        description: 'Operating room management and status'
      },
      {
        name: 'Scheduling',
        description: 'Surgery scheduling operations'
      },
      {
        name: 'Queue',
        description: 'Queue management for pending requests'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

/**
 * Generate Swagger specification
 */
export const swaggerSpec = swaggerJsdoc(options); 