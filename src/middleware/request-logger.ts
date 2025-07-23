import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { ExtendedRequest } from '../types';

/**
 * Custom morgan token for response time
 */
morgan.token('response-time', (req: Request, res: Response) => {
  const extendedReq = req as ExtendedRequest;
  if (extendedReq.startTime) {
    return `${Date.now() - extendedReq.startTime}ms`;
  }
  return '-';
});

/**
 * Custom morgan token for request body size
 */
morgan.token('body-size', (req: Request) => {
  const contentLength = req.headers['content-length'];
  return contentLength ? `${contentLength}b` : '-';
});

/**
 * Request timing middleware
 */
export const requestTiming = (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
): void => {
  req.startTime = Date.now();
  next();
};

/**
 * Development logging format
 */
const developmentFormat = ':method :url :status :response-time - :body-size';

/**
 * Production logging format (minimal)
 */
const productionFormat = ':method :url :status :response-time';

/**
 * Get appropriate logging format based on environment
 */
const getLogFormat = (): string => {
  return process.env.NODE_ENV === 'development' ? developmentFormat : productionFormat;
};

/**
 * Request logger middleware
 */
export const requestLogger = morgan(getLogFormat(), {
  skip: (req: Request, res: Response) => {
    // Skip logging for health check endpoints in production
    return process.env.NODE_ENV === 'production' && req.path === '/health';
  },
}); 