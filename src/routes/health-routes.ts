import { Router } from 'express';
import { HealthController } from '../controllers/health-controller';
import { HealthService } from '../services/health-service';

/**
 * Health routes configuration
 */
export const createHealthRoutes = (): Router => {
  const router = Router();
  const healthService = new HealthService();
  const healthController = new HealthController(healthService);

  /**
   * @route   GET /health
   * @desc    Check application health status
   * @access  Public
   */
  router.get('/', healthController.checkHealth.bind(healthController));

  return router;
}; 