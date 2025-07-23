import { 
  SurgeryType, 
  Equipment, 
  DoctorType
} from '../types/surgery';

import {
  INITIAL_OPERATING_ROOMS,
  SURGERY_REQUIREMENTS,
  getSurgeryDuration,
  hasRequiredEquipment
} from '../config/surgery-config';

describe('Surgery Types and Configuration', () => {
  describe('Surgery Requirements', () => {
    it('should have correct requirements for heart surgery', () => {
      const heartSurgery = SURGERY_REQUIREMENTS[SurgeryType.HEART_SURGERY];
      
      expect(heartSurgery.surgeryType).toBe(SurgeryType.HEART_SURGERY);
      expect(heartSurgery.requiredEquipment).toEqual([Equipment.ECG]);
      expect(heartSurgery.duration).toBe(3);
      expect(heartSurgery.doctorType).toBe(DoctorType.HEART_SURGEON);
    });

    it('should have correct requirements for brain surgery', () => {
      const brainSurgery = SURGERY_REQUIREMENTS[SurgeryType.BRAIN_SURGERY];
      
      expect(brainSurgery.surgeryType).toBe(SurgeryType.BRAIN_SURGERY);
      expect(brainSurgery.requiredEquipment).toEqual([Equipment.MRI]);
      expect(brainSurgery.duration).toBe(3);
      expect(brainSurgery.doctorType).toBe(DoctorType.BRAIN_SURGEON);
    });
  });

  describe('Operating Rooms Configuration', () => {
    it('should have exactly 5 operating rooms', () => {
      expect(INITIAL_OPERATING_ROOMS).toHaveLength(5);
    });

    it('should have correct equipment for OR 1 (MRI + CT + ECG)', () => {
      const or1 = INITIAL_OPERATING_ROOMS.find(or => or.id === 1);
      expect(or1?.equipment).toEqual([Equipment.MRI, Equipment.CT, Equipment.ECG]);
    });

    it('should have correct equipment for OR 2 and 3 (CT + MRI)', () => {
      const or2 = INITIAL_OPERATING_ROOMS.find(or => or.id === 2);
      const or3 = INITIAL_OPERATING_ROOMS.find(or => or.id === 3);
      
      expect(or2?.equipment).toEqual([Equipment.CT, Equipment.MRI]);
      expect(or3?.equipment).toEqual([Equipment.CT, Equipment.MRI]);
    });

    it('should have correct equipment for OR 4 and 5 (MRI + ECG)', () => {
      const or4 = INITIAL_OPERATING_ROOMS.find(or => or.id === 4);
      const or5 = INITIAL_OPERATING_ROOMS.find(or => or.id === 5);
      
      expect(or4?.equipment).toEqual([Equipment.MRI, Equipment.ECG]);
      expect(or5?.equipment).toEqual([Equipment.MRI, Equipment.ECG]);
    });
  });

  describe('Surgery Duration Logic', () => {
    it('should return 3 hours for heart surgery regardless of equipment', () => {
      const duration = getSurgeryDuration(SurgeryType.HEART_SURGERY, [Equipment.ECG]);
      expect(duration).toBe(3);
    });

    it('should return 2 hours for brain surgery with CT machine', () => {
      const duration = getSurgeryDuration(SurgeryType.BRAIN_SURGERY, [Equipment.MRI, Equipment.CT]);
      expect(duration).toBe(2);
    });

    it('should return 3 hours for brain surgery without CT machine', () => {
      const duration = getSurgeryDuration(SurgeryType.BRAIN_SURGERY, [Equipment.MRI]);
      expect(duration).toBe(3);
    });
  });

  describe('Equipment Requirements', () => {
    it('should allow heart surgery in OR with ECG', () => {
      const hasEquipment = hasRequiredEquipment(SurgeryType.HEART_SURGERY, [Equipment.ECG]);
      expect(hasEquipment).toBe(true);
    });

    it('should not allow heart surgery in OR without ECG', () => {
      const hasEquipment = hasRequiredEquipment(SurgeryType.HEART_SURGERY, [Equipment.MRI, Equipment.CT]);
      expect(hasEquipment).toBe(false);
    });

    it('should allow brain surgery in OR with MRI', () => {
      const hasEquipment = hasRequiredEquipment(SurgeryType.BRAIN_SURGERY, [Equipment.MRI]);
      expect(hasEquipment).toBe(true);
    });

    it('should allow brain surgery in OR with MRI and CT', () => {
      const hasEquipment = hasRequiredEquipment(SurgeryType.BRAIN_SURGERY, [Equipment.MRI, Equipment.CT]);
      expect(hasEquipment).toBe(true);
    });

    it('should not allow brain surgery in OR without MRI', () => {
      const hasEquipment = hasRequiredEquipment(SurgeryType.BRAIN_SURGERY, [Equipment.CT, Equipment.ECG]);
      expect(hasEquipment).toBe(false);
    });
  });
}); 