import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { HealthCheckResponse } from '../types';
import { IHealthService } from '../services/health-service';

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthCheckResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the health check was successful
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [healthy, unhealthy]
 *               description: Health status of the application
 *             timestamp:
 *               type: string
 *               format: date-time
 *               description: Current timestamp
 *             uptime:
 *               type: number
 *               description: Application uptime in milliseconds
 *             environment:
 *               type: string
 *               description: Current environment
 *             version:
 *               type: string
 *               description: Application version
 *         message:
 *           type: string
 *           description: Additional information about the health check
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Response timestamp
 */

/**
 * Health controller interface
 */
export interface IHealthController {
  checkHealth(req: Request, res: Response): Promise<void>;
}

/**
 * Health controller implementation
 */
export class HealthController implements IHealthController {
  private readonly healthService: IHealthService;

  constructor(healthService: IHealthService) {
    this.healthService = healthService;
  }

  /**
   * Handle health check request
   * @swagger
   * /api/v1/health:
   *   get:
   *     summary: Check application health status
   *     description: Returns the current health status of the application including uptime, environment, and version information
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Application is healthy
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthCheckResponse'
   *             example:
   *               success: true
   *               data:
   *                 status: "healthy"
   *                 timestamp: "2024-01-15T10:00:00.000Z"
   *                 uptime: 3600000
   *                 environment: "development"
   *                 version: "1.0.0"
   *               message: "Health check completed successfully"
   *               timestamp: "2024-01-15T10:00:00.000Z"
   *       500:
   *         description: Application health check failed
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               success: false
   *               error: "Health check failed"
   *               timestamp: "2024-01-15T10:00:00.000Z"
   */
  public async checkHealth(req: Request, res: Response): Promise<void> {
    try {
      const healthData = await this.healthService.checkHealth();
      
      const response: ApiResponse<HealthCheckResponse> = {
        success: true,
        data: healthData,
        message: 'Health check completed successfully',
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      };

      res.status(500).json(response);
    }
  }
} 