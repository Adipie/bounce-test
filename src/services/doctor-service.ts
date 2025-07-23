import { Doctor, DoctorType, SurgeryType } from '../types/surgery';

const doctors: Doctor[] = [
  // Example doctors (can be replaced with DB or other storage)
  { id: '1', name: 'Dr. Heart', type: DoctorType.HEART_SURGEON, surgeryType: SurgeryType.HEART_SURGERY, isActive: true },
  { id: '2', name: 'Dr. Brain', type: DoctorType.BRAIN_SURGEON, surgeryType: SurgeryType.BRAIN_SURGERY, isActive: true },
];

class DoctorService {
  /**
   * Get doctor by ID
   */
  getDoctorById(id: string): Doctor | undefined {
    return doctors.find((doc) => doc.id === id);
  }

  /**
   * Validate if doctor can perform a given surgery type
   */
  canPerformSurgery(doctorId: string, surgeryType: SurgeryType): boolean {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor || !doctor.isActive) return false;
    return doctor.surgeryType === surgeryType;
  }

  /**
   * List all active doctors
   */
  getActiveDoctors(): Doctor[] {
    return doctors.filter((doc) => doc.isActive);
  }
}

export const doctorService = new DoctorService(); 