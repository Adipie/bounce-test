import { Router } from 'express';
import { scheduleController } from '../controllers/schedule-controller';

const router = Router();

/**
 * @openapi
 * /api/v1/schedule/request:
 *   post:
 *     summary: Request a surgery schedule
 *     tags:
 *       - Scheduling
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScheduleRequest'
 *     responses:
 *       201:
 *         description: Surgery scheduled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       202:
 *         description: No slot available, request added to queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 queued:
 *                   type: boolean
 *                   example: true
 *                 queuePosition:
 *                   type: integer
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       409:
 *         description: Slot unavailable or other conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/request', scheduleController.requestSchedule);

export default router; 