import { HealthCheckResponse } from '../types';

/**
 * Health service interface
 */
export interface IHealthService {
  checkHealth(): Promise<HealthCheckResponse>;
}

/**
 * Health service implementation
 */
export class HealthService implements IHealthService {
  private readonly startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Check application health status
   */
  public async checkHealth(): Promise<HealthCheckResponse> {
    const uptime = Date.now() - this.startTime;
    
    const healthResponse: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };

    return healthResponse;
  }

  /**
   * Get application uptime in milliseconds
   */
  public getUptime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Check if application is healthy
   */
  public isHealthy(): boolean {
    // Add any health checks here (database, external services, etc.)
    return true;
  }
} 