import { 
  SurgeryType, 
  Equipment, 
  DoctorType, 
  SurgeryRequirements,
  OperatingRoom,
  Hospital,
  ScheduleStatus
} from '../types/surgery';

/**
 * Surgery requirements mapping
 * Defines what equipment each surgery type needs and its duration
 */
export const SURGERY_REQUIREMENTS: Record<SurgeryType, SurgeryRequirements> = {
  [SurgeryType.HEART_SURGERY]: {
    surgeryType: SurgeryType.HEART_SURGERY,
    requiredEquipment: [Equipment.ECG],
    duration: 3, // 3 hours as specified
    doctorType: DoctorType.HEART_SURGEON
  },
  [SurgeryType.BRAIN_SURGERY]: {
    surgeryType: SurgeryType.BRAIN_SURGERY,
    requiredEquipment: [Equipment.MRI], // Base requirement
    duration: 3, // Default 3 hours, will be adjusted based on CT availability
    doctorType: DoctorType.BRAIN_SURGEON
  }
};

/**
 * Helper function to get surgery duration based on available equipment
 * Brain surgery takes 2 hours if CT is available, 3 hours otherwise
 */
export const getSurgeryDuration = (
  surgeryType: SurgeryType, 
  availableEquipment: Equipment[]
): number => {
  const baseRequirements = SURGERY_REQUIREMENTS[surgeryType];
  
  if (surgeryType === SurgeryType.BRAIN_SURGERY) {
    // Check if CT machine is available
    const hasCT = availableEquipment.includes(Equipment.CT);
    return hasCT ? 2 : 3; // 2 hours with CT, 3 hours without
  }
  
  return baseRequirements.duration;
};

/**
 * Helper function to check if an OR has required equipment for a surgery
 */
export const hasRequiredEquipment = (
  surgeryType: SurgeryType,
  availableEquipment: Equipment[]
): boolean => {
  const requirements = SURGERY_REQUIREMENTS[surgeryType];
  
  if (surgeryType === SurgeryType.BRAIN_SURGERY) {
    // Brain surgery only requires MRI (CT is optional for duration)
    return availableEquipment.includes(Equipment.MRI);
  }
  
  // For heart surgery, check if all required equipment is available
  return requirements.requiredEquipment.every(equipment => 
    availableEquipment.includes(equipment)
  );
};

const now = new Date();
const today10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0, 0);
const today13 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 0, 0, 0);
const today16 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0, 0);
const today11 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 0, 0, 0);
const today14 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0, 0, 0);
const today17 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
const today12 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
const today18 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);

const mockSchedules = [
  {
    id: 'sch-1',
    doctorId: '1',
    surgeryType: SurgeryType.HEART_SURGERY,
    operatingRoomId: 1,
    startTime: today10,
    endTime: today13,
    status: ScheduleStatus.SCHEDULED,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'sch-2',
    doctorId: '2',
    surgeryType: SurgeryType.BRAIN_SURGERY,
    operatingRoomId: 1,
    startTime: today14,
    endTime: today17,
    status: ScheduleStatus.SCHEDULED,
    createdAt: now,
    updatedAt: now,
  },
];

/**
 * Initial operating room configurations as specified in requirements
 * 5 ORs with different equipment combinations
 */
export const INITIAL_OPERATING_ROOMS: OperatingRoom[] = [
  {
    id: 1,
    equipment: [Equipment.MRI, Equipment.CT, Equipment.ECG],
    isActive: true,
    schedules: [...mockSchedules],
  },
  {
    id: 2,
    equipment: [Equipment.CT, Equipment.MRI],
    isActive: true,
    schedules: [
      {
        id: 'sch-3',
        doctorId: '2',
        surgeryType: SurgeryType.BRAIN_SURGERY,
        operatingRoomId: 2,
        startTime: today10,
        endTime: today12,
        status: ScheduleStatus.SCHEDULED,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'sch-4',
        doctorId: '1',
        surgeryType: SurgeryType.HEART_SURGERY,
        operatingRoomId: 2,
        startTime: today13,
        endTime: today16,
        status: ScheduleStatus.SCHEDULED,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: 3,
    equipment: [Equipment.CT, Equipment.MRI],
    isActive: true,
    schedules: [],
  },
  {
    id: 4,
    equipment: [Equipment.MRI, Equipment.ECG],
    isActive: true,
    schedules: [
      {
        id: 'sch-5',
        doctorId: '1',
        surgeryType: SurgeryType.HEART_SURGERY,
        operatingRoomId: 4,
        startTime: today11,
        endTime: today14,
        status: ScheduleStatus.SCHEDULED,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
  {
    id: 5,
    equipment: [Equipment.MRI, Equipment.ECG],
    isActive: true,
    schedules: [
      {
        id: 'sch-6',
        doctorId: '2',
        surgeryType: SurgeryType.BRAIN_SURGERY,
        operatingRoomId: 5,
        startTime: today16,
        endTime: today18,
        status: ScheduleStatus.SCHEDULED,
        createdAt: now,
        updatedAt: now,
      },
    ],
  },
];

/**
 * Initial hospital configuration
 */
export const INITIAL_HOSPITAL: Hospital = {
  id: 'main-hospital',
  name: 'Main Hospital',
  operatingRooms: INITIAL_OPERATING_ROOMS
};

/**
 * Working hours configuration
 */
export const WORKING_HOURS = {
  startHour: 10, // 10:00 AM
  endHour: 18,   // 6:00 PM
  daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
};

/**
 * Helper function to check if a time is within working hours
 */
export const isWithinWorkingHours = (date: Date): boolean => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = date.getHours();
  
  return WORKING_HOURS.daysOfWeek.includes(dayOfWeek) &&
         hour >= WORKING_HOURS.startHour &&
         hour < WORKING_HOURS.endHour;
};

/**
 * Helper function to get next working day start time
 */
export const getNextWorkingDayStart = (fromDate: Date): Date => {
  const nextDay = new Date(fromDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(WORKING_HOURS.startHour, 0, 0, 0);
  
  // If it's weekend, move to Monday
  while (!WORKING_HOURS.daysOfWeek.includes(nextDay.getDay())) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
};

/**
 * Helper function to get the end of current working day
 */
export const getEndOfWorkingDay = (date: Date): Date => {
  const endOfDay = new Date(date);
  endOfDay.setHours(WORKING_HOURS.endHour, 0, 0, 0);
  return endOfDay;
}; 