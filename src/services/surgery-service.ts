import { SurgeryType, Equipment, OperatingRoom } from '../types/surgery';
import { SURGERY_REQUIREMENTS, getSurgeryDuration, hasRequiredEquipment } from '../config/surgery-config';

class SurgeryService {
  /**
   * Validate if an OR has the required equipment for a surgery
   */
  hasRequiredEquipment(surgeryType: SurgeryType, or: OperatingRoom): boolean {
    return hasRequiredEquipment(surgeryType, or.equipment);
  }

  /**
   * Calculate the duration of a surgery in a given OR
   */
  getSurgeryDuration(surgeryType: SurgeryType, or: OperatingRoom): number {
    return getSurgeryDuration(surgeryType, or.equipment);
  }

  /**
   * Get the requirements for a surgery type
   */
  getSurgeryRequirements(surgeryType: SurgeryType) {
    return SURGERY_REQUIREMENTS[surgeryType];
  }
}

export const surgeryService = new SurgeryService(); 