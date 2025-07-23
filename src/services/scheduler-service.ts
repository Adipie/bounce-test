import { OperatingRoom, SurgeryType, Schedule, ScheduleStatus, QueueItem, QueueStatus } from '../types/surgery';
import { hospitalService } from './hospital-service';
import { surgeryService } from './surgery-service';
import { v4 as uuidv4 } from 'uuid';
import { isWithinWorkingHours, getEndOfWorkingDay, getNextWorkingDayStart } from '../config/surgery-config';

const queue: QueueItem[] = [];
const orLocks: Record<number, boolean> = {};

function acquireLock(orId: number): boolean {
  if (orLocks[orId]) return false; // Already locked
  orLocks[orId] = true;
  return true;
}

function releaseLock(orId: number): void {
  orLocks[orId] = false;
}

class SchedulerService {
  /**
   * Find the next available slot for a surgery type and doctor within 1 week
   */
  findAvailableSlot(surgeryType: SurgeryType): {
    operatingRoom: OperatingRoom;
    startTime: Date;
    endTime: Date;
  } | null {
    const rooms = hospitalService.getOperatingRooms().filter(or =>
      or.isActive && surgeryService.hasRequiredEquipment(surgeryType, or)
    );
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    for (const or of rooms) {
      // Calculate duration for this room
      const durationHours = surgeryService.getSurgeryDuration(surgeryType, or);
      let searchStart = now;
      const sortedSchedules = [...or.schedules].sort((a, b) => new Date(a.endTime).getTime() - new Date(b.endTime).getTime());
      for (let i = 0; i <= sortedSchedules.length; i++) {
        let slotStart: Date;
        let slotEnd: Date;
        if (i === 0) {
          slotStart = searchStart;
        } else {
          slotStart = new Date(sortedSchedules[i - 1]?.endTime ?? 0);
        }
        slotEnd = new Date(slotStart.getTime() + durationHours * 60 * 60 * 1000);
        // Check working hours
        if (!isWithinWorkingHours(slotStart) || !isWithinWorkingHours(slotEnd)) {
          slotStart = getNextWorkingDayStart(slotStart);
          slotEnd = new Date(slotStart.getTime() + durationHours * 60 * 60 * 1000);
        }
        // Enforce 1-week scheduling window
        if (slotStart > oneWeekFromNow) {
          break;
        }
        // Check for overlap with next schedule
        if (i < sortedSchedules.length && slotEnd > new Date(sortedSchedules[i]?.startTime ?? 0)) {
          continue;
        }
        // Found a slot within 1 week
        return { operatingRoom: or, startTime: slotStart, endTime: slotEnd };
      }
    }
    return null;
  }

  processQueue(): { processed: number; scheduled: Schedule[] } {
    let processed = 0;
    const scheduled: Schedule[] = [];
    for (let i = 0; i < queue.length; ) {
      const item = queue[i];
      if (!item) {
        i++;
        continue;
      }
      const result = this.scheduleSurgery(item.doctorId, item.surgeryType);
      if (result.success) {
        scheduled.push(result.schedule);
        queue.splice(i, 1); // Remove from queue
        processed++;
      } else {
        i++; // Only increment if not removed
      }
    }
    return { processed, scheduled };
  }

  /**
   * Schedule a surgery or add to queue if no slot available within 1 week
   */
  scheduleSurgery(doctorId: string, surgeryType: SurgeryType):
    | { success: true; schedule: Schedule }
    | { success: false; queued: true; queuePosition: number }
    | { success: false; error: string } {
    const rooms = hospitalService.getOperatingRooms().filter(or => surgeryService.hasRequiredEquipment(surgeryType, or));
    if (rooms.length === 0) {
      return { success: false, error: 'NO_ROOM_WITH_REQUIRED_EQUIPMENT' };
    }
    const slot = this.findAvailableSlot(surgeryType);
    if (slot) {
      // Try to acquire lock for the operating room
      if (!acquireLock(slot.operatingRoom.id)) {
        // Could not acquire lock, treat as conflict (or retry, or queue)
        return { success: false, error: 'LOCK_CONFLICT' };
      }
      try {
        // Double-check slot is still available after acquiring lock
        if (!hospitalService.isOperatingRoomAvailable(slot.operatingRoom.id, slot.startTime, slot.endTime)) {
          return { success: false, error: 'SLOT_CONFLICT' };
        }
        const schedule: Schedule = {
          id: uuidv4(),
          doctorId,
          surgeryType,
          operatingRoomId: slot.operatingRoom.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: ScheduleStatus.SCHEDULED,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        slot.operatingRoom.schedules.push(schedule);
        return { success: true, schedule };
      } finally {
        releaseLock(slot.operatingRoom.id);
      }
    } else {
      // Add to queue if no slot within 1 week
      const queueItem: QueueItem = {
        id: uuidv4(),
        doctorId,
        surgeryType,
        requestTime: new Date(),
        priority: 1,
        status: QueueStatus.WAITING,
      };
      queue.push(queueItem);
      return { success: false, queued: true, queuePosition: queue.length };
    }
  }

  /**
   * Get current queue
   */
  getQueue(): QueueItem[] {
    return queue;
  }
}

export const schedulerService = new SchedulerService(); 