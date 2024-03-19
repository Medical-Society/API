import { z } from 'zod';
import { paginationQuery, zodObjectId } from './customZod';
import { AppointmentStatus } from '../models/enums';

export const bookAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      doctorId: zodObjectId,
      date: z.coerce.date(),
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
      status: z.nativeEnum(AppointmentStatus).optional(),
      doctor: zodObjectId.optional(),
      paid: z.coerce.boolean().optional(),
      price: z.number().optional(),
    })
    .merge(paginationQuery)
    .strict(),
});

export const getAppointmentByIdSchema = z.object({
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

export const changeAppointmentStatusSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      status: z.nativeEnum(AppointmentStatus),
    })
    .strict(),
  params: z
    .object({
      appointmentId: zodObjectId,
    })
    .strict(),
});

export type ChangeAppointmentStatusBodyInput = z.infer<
  typeof changeAppointmentStatusSchema
>['body'];
export type ChangeAppointmentStatusParamsInput = z.infer<
  typeof changeAppointmentStatusSchema
>['params'];

export type GetAppointmentBodyInput = z.infer<
  typeof getAppointmentByIdSchema
>['body'];
export type GetAppointmentParamsInput = z.infer<
  typeof getAppointmentByIdSchema
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
