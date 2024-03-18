import { z } from 'zod';
import { zodObjectId } from './customZod';
import { AvailableTime, TimeSlot } from '../models/availableTime';
import { WeekDay } from '../models/enums';

export const getAvailableTimesSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      doctorId: zodObjectId,
    })
    .strict(),
});

const timeSlotOptionalSchema = z
  .object({
    from: z.object({
      hour: z.number(),
      minute: z.number(),
    }),
    to: z.object({
      hour: z.number(),
      minute: z.number(),
    }),
  })
  .optional();

export const updateAvailableTimeSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      availableTime: z.object({
        limit: z.number().optional(),
        weekdays: z.object({
          SUNDAY: timeSlotOptionalSchema,
          MONDAY: timeSlotOptionalSchema,
          TUESDAY: timeSlotOptionalSchema,
          WEDNESDAY: timeSlotOptionalSchema,
          THURSDAY: timeSlotOptionalSchema,
          FRIDAY: timeSlotOptionalSchema,
          SATURDAY: timeSlotOptionalSchema,
        }),
      }),
    })
    .strict(),
});

export type GetAvailableTimesBodyInput = z.infer<
  typeof getAvailableTimesSchema
>['body'];

export type UpdateAvailableTimeBodyInput = z.infer<
  typeof updateAvailableTimeSchema
>['body'];

export type AvailableTimeInput = z.infer<
  typeof updateAvailableTimeSchema
>['body']['availableTime'];
