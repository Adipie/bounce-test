/**
 * Surgery types supported by the system
 */
export enum SurgeryType {
  HEART_SURGERY = 'HEART_SURGERY',
  BRAIN_SURGERY = 'BRAIN_SURGERY'
}

/**
 * Equipment types available in operating rooms
 */
export enum Equipment {
  MRI = 'MRI',
  CT = 'CT',
  ECG = 'ECG'
}

/**
 * Doctor types/specializations
 */
export enum DoctorType {
  HEART_SURGEON = 'HEART_SURGEON',
  BRAIN_SURGEON = 'BRAIN_SURGEON'
}

/**
 * Schedule status for tracking surgery states
 */
export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

/**
 * Queue item status
 */
export enum QueueStatus {
  WAITING = 'WAITING',
  PROCESSING = 'PROCESSING',
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED'
}

/**
 * Surgery requirements mapping
 */
export interface SurgeryRequirements {
  surgeryType: SurgeryType;
  requiredEquipment: Equipment[];
  duration: number; // in hours
  doctorType: DoctorType;
}

/**
 * Operating room configuration
 */
export interface OperatingRoom {
  id: number;
  equipment: Equipment[];
  isActive: boolean;
  schedules: Schedule[];
}

/**
 * Doctor entity
 */
export interface Doctor {
  id: string;
  name: string;
  type: DoctorType;
  surgeryType: SurgeryType;
  isActive: boolean;
}

/**
 * Schedule for a surgery
 */
export interface Schedule {
  id: string;
  doctorId: string;
  surgeryType: SurgeryType;
  operatingRoomId: number;
  startTime: Date;
  endTime: Date;
  status: ScheduleStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Queue item for waiting doctors
 */
export interface QueueItem {
  id: string;
  doctorId: string;
  surgeryType: SurgeryType;
  requestTime: Date;
  priority: number;
  status: QueueStatus;
  estimatedWaitTime?: string;
}

/**
 * Hospital entity containing all ORs
 */
export interface Hospital {
  id: string;
  name: string;
  operatingRooms: OperatingRoom[];
}

/**
 * API request for scheduling
 */
export interface ScheduleRequest {
  doctorId: string;
  surgeryType: SurgeryType;
}

/**
 * API response for successful scheduling
 */
export interface ScheduleResponse {
  success: boolean;
  data?: {
    scheduleId: string;
    operatingRoomId: number;
    startTime: Date;
    endTime: Date;
    surgeryType: SurgeryType;
  };
  error?: string;
  message?: string;
}

/**
 * API response for slot conflicts
 */
export interface SlotConflictResponse {
  success: false;
  error: 'SLOT_UNAVAILABLE';
  data: {
    nextAvailableSlot?: {
      operatingRoomId: number;
      startTime: Date;
      endTime: Date;
    };
  };
  message: string;
}

/**
 * API response for queued requests
 */
export interface QueuedResponse {
  success: false;
  error: 'QUEUED';
  data: {
    queuePosition: number;
    estimatedWaitTime: string;
  };
  message: string;
}

/**
 * Operating room status response
 */
export interface OperatingRoomStatus {
  id: number;
  equipment: Equipment[];
  isActive: boolean;
  currentSchedule?: {
    scheduleId: string;
    doctorId: string;
    surgeryType: SurgeryType;
    startTime: Date;
    endTime: Date;
    status: ScheduleStatus;
  };
  nextAvailableTime?: Date;
}

/**
 * Queue status response
 */
export interface QueueStatusResponse {
  totalItems: number;
  items: Array<{
    position: number;
    doctorId: string;
    surgeryType: SurgeryType;
    requestTime: Date;
    estimatedWaitTime: string;
  }>;
} 