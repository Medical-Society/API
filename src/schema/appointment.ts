import { z } from 'zod';
import { validAgeDate, zodObjectId } from './customZod';
import { AppointmentStatus } from '../models/enums';

export const bookAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      doctorId: zodObjectId,
      date: z.string(),
    })
    .strict(),
});

export const searchAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  query: z
    .object({
      page: z.coerce.number().min(1, 'Page must be at least 1').optional(),
      limit: z.coerce.number().min(1, 'Limit must be at least 1').optional(),
      status: z.nativeEnum(AppointmentStatus).optional(),
      doctor: zodObjectId.optional(),
      paid: z.coerce.boolean().optional(),
      price: z.number().optional(),
    })
    .strict(),
});

export const getAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  params: z
    .object({
      appointmentId: zodObjectId,
    })
    .strict(),
});

export type GetAppointmentBodyInput = z.infer<
  typeof getAppointmentSchema
>['body'];
export type GetAppointmentParamsInput = z.infer<
  typeof getAppointmentSchema
>['params'];

export type SearchAppointmentBodyInput = z.infer<
  typeof searchAppointmentSchema
>['body'];
export type SearchAppointmentQueryInput = z.infer<
  typeof searchAppointmentSchema
>['query'];
export type BookAppointmentBodyInput = z.infer<
  typeof bookAppointmentSchema
>['body'];
