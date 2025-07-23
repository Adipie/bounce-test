import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { environmentConfig } from './config/environment';
import { requestTiming, requestLogger } from './middleware/request-logger';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { setupSwagger } from './middleware/swagger';
import { createHealthRoutes } from './routes/health-routes';
import scheduleRoutes from './routes/schedule-routes';
import operatingRoomRoutes from './routes/operating-room-routes';

/**
 * Express application class
 */
export class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Setup application middleware
   */
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : true,
      credentials: true,
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request timing and logging
    this.app.use(requestTiming);
    this.app.use(requestLogger);
  }

  /**
   * Setup application routes
   */
  private setupRoutes(): void {
    const apiPrefix = environmentConfig.getApiPrefix();

    // Setup Swagger documentation
    setupSwagger(this.app);

    // Health check route
    this.app.use(`${apiPrefix}/health`, createHealthRoutes());

    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to Operating Room Scheduler API',
        version: '1.0.0',
        documentation: '/api-docs',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use('/api/v1/schedule', scheduleRoutes);
    this.app.use('/api/v1/operating-rooms', operatingRoomRoutes);
  }

  /**
   * Setup error handling middleware
   */
  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);
    
    // Global error handler (must be last)
    this.app.use(errorHandler);
  }

  /**
   * Get Express application instance
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Start the server
   */
  public start(): void {
    const port = environmentConfig.getPort();
    
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📊 Environment: ${environmentConfig.getNodeEnv()}`);
      console.log(`🔗 Health check: http://localhost:${port}${environmentConfig.getApiPrefix()}/health`);
    });
  }
} 