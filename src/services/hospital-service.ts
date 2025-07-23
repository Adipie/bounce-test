import { OperatingRoom, Hospital } from '../types/surgery';
import { INITIAL_HOSPITAL } from '../config/surgery-config';

class HospitalService {
  private hospital: Hospital;

  constructor() {
    this.hospital = { ...INITIAL_HOSPITAL };
  }

  /**
   * Get all operating rooms
   */
  getOperatingRooms(): OperatingRoom[] {
    return this.hospital.operatingRooms;
  }

  /**
   * Get a specific operating room by ID
   */
  getOperatingRoomById(id: number): OperatingRoom | undefined {
    return this.hospital.operatingRooms.find((or) => or.id === id);
  }

  /**
   * Check if an operating room is available for a given time window
   */
  isOperatingRoomAvailable(orId: number, start: Date, end: Date): boolean {
    const or = this.getOperatingRoomById(orId);
    if (!or || !or.isActive) return false;
    // Check for schedule conflicts
    return !or.schedules.some((schedule) => {
      // Overlap if start < existing end && end > existing start
      return (
        start < new Date(schedule.endTime) &&
        end > new Date(schedule.startTime)
      );
    });
  }
}

export const hospitalService = new HospitalService(); 