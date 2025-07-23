import { Request, Response } from 'express';
import { schedulerService } from '../services/scheduler-service';
import { doctorService } from '../services/doctor-service';
import { scheduleRequestSchema } from '../validation/surgery-schemas';

export const scheduleController = {
  requestSchedule: (req: Request, res: Response) => {
    const parseResult = scheduleRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'INVALID_REQUEST', details: parseResult.error.errors });
    }
    const { doctorId, surgeryType } = parseResult.data;
    // Validate doctor
    if (!doctorService.canPerformSurgery(doctorId, surgeryType)) {
      return res.status(400).json({ error: 'DOCTOR_CANNOT_PERFORM_SURGERY' });
    }
    // Process the queue before handling the new request
    schedulerService.processQueue();
    const result = schedulerService.scheduleSurgery(doctorId, surgeryType);
    if (result.success) {
      return res.status(201).json({ success: true, schedule: result.schedule });
    } else if ('queued' in result && result.queued) {
      return res.status(202).json({ success: false, queued: true, queuePosition: result.queuePosition });
    } else {
      return res.status(409).json({ success: false, error: 'error' in result ? result.error : 'UNKNOWN_ERROR' });
    }
  },
}; 