import { Request, Response, NextFunction } from 'express';

/**
 * Standard API response interface
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Health check response interface
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
}

/**
 * Extended Express Request interface for middleware
 */
export interface ExtendedRequest extends Request {
  startTime?: number;
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Middleware function type
 */
export type MiddlewareFunction = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * Route handler function type
 */
export type RouteHandler<T = unknown> = (
  req: ExtendedRequest,
  res: Response
) => Promise<ApiResponse<T>>;

// Re-export surgery types
export * from './surgery'; 