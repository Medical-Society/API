import { z } from 'zod';
import { zodObjectId } from './customZod';

export const getAvailableTimesSchema = z.object({
  params: z
    .object({
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
  .refine(
    (val) =>
      val.from.hour * 60 + val.from.minute < val.to.hour * 60 + val.to.minute,
    { message: 'Invalid time' },
  ).optional();

export const updateAvailableTimeSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      availableTime: z.object({
        limit: z.number().optional(),
        price: z.number().optional(),
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
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
});

export type GetAvailableTimesParamsInput = z.infer<
  typeof getAvailableTimesSchema
>['params'];

export type UpdateAvailableTimeBodyInput = z.infer<
  typeof updateAvailableTimeSchema
>['body'];

export type AvailableTimeInput = z.infer<
  typeof updateAvailableTimeSchema
>['body']['availableTime'];
