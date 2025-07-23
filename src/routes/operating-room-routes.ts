import { Router } from 'express';
import { operatingRoomController } from '../controllers/operating-room-controller';

const router = Router();
/**
 * @openapi
 * /api/v1/operating-rooms:
 *   get:
 *     summary: Get all operating rooms and their schedules
 *     tags:
 *       - Operating Rooms
 *     responses:
 *       200:
 *         description: List of operating rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OperatingRoomStatus'
 */
router.get('/', operatingRoomController.getAll);
export default router; 