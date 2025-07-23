import { z } from 'zod';
import { SurgeryType, DoctorType } from '../types/surgery';

/**
 * Zod schema for surgery type validation
 */
export const surgeryTypeSchema = z.nativeEnum(SurgeryType);

/**
 * Zod schema for doctor type validation
 */
export const doctorTypeSchema = z.nativeEnum(DoctorType);

/**
 * Zod schema for schedule request validation
 */
export const scheduleRequestSchema = z.object({
  doctorId: z.string().min(1),
  surgeryType: surgeryTypeSchema,
});

/**
 * Zod schema for doctor creation request
 */
export const createDoctorSchema = z.object({
  id: z.string().min(1, 'Doctor ID is required'),
  name: z.string().min(1, 'Doctor name is required'),
  type: doctorTypeSchema,
  surgeryType: surgeryTypeSchema
});

/**
 * Zod schema for operating room status query
 */
export const operatingRoomQuerySchema = z.object({
  includeSchedules: z.boolean().optional().default(false),
  date: z.string().datetime().optional()
});

/**
 * Zod schema for queue status query
 */
export const queueStatusQuerySchema = z.object({
  limit: z.number().min(1).max(100).optional().default(50),
  offset: z.number().min(0).optional().default(0)
});

/**
 * Zod schema for schedule status query
 */
export const scheduleStatusQuerySchema = z.object({
  scheduleId: z.string().min(1, 'Schedule ID is required')
});

/**
 * Type definitions derived from schemas
 */
export type ScheduleRequest = z.infer<typeof scheduleRequestSchema>;
export type CreateDoctorRequest = z.infer<typeof createDoctorSchema>;
export type OperatingRoomQuery = z.infer<typeof operatingRoomQuerySchema>;
export type QueueStatusQuery = z.infer<typeof queueStatusQuerySchema>;
export type ScheduleStatusQuery = z.infer<typeof scheduleStatusQuerySchema>; 