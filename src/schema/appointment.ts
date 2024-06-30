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

export const searchPatientAppointmentSchema = z.object({
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
      doctorId: zodObjectId.optional(),
      paid: z.coerce.boolean().optional(),
      price: z.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
    })
    .merge(paginationQuery)
    .strict(),
});

export const searchDoctorAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
    })
    .strict(),
  query: z
    .object({
      status: z.nativeEnum(AppointmentStatus).optional(),
      patientId: zodObjectId.optional(),
      paid: z.coerce.boolean().optional(),
      price: z.number().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
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

export const updateAppointmentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      status: z.nativeEnum(AppointmentStatus).optional(),
      paid: z.coerce.boolean().optional(),
      price: z.number().optional(),
      date: z.coerce.date().optional(),
    })
    .strict(),
  params: z
    .object({
      appointmentId: zodObjectId,
    })
    .strict(),
});

export type UpdateAppointmentBodyInput = z.infer<
  typeof updateAppointmentSchema
>['body'];
export type UpdateAppointmentParamsInput = z.infer<
  typeof updateAppointmentSchema
>['params'];

export type GetAppointmentBodyInput = z.infer<
  typeof getAppointmentByIdSchema
>['body'];
export type GetAppointmentParamsInput = z.infer<
  typeof getAppointmentByIdSchema
>['params'];

export type SearchPatientAppointmentBodyInput = z.infer<
  typeof searchPatientAppointmentSchema
>['body'];
export type SearchPatientAppointmentQueryInput = z.infer<
  typeof searchPatientAppointmentSchema
>['query'];
export type BookAppointmentBodyInput = z.infer<
  typeof bookAppointmentSchema
>['body'];

export type SearchDoctorAppointmentBodyInput = z.infer<
  typeof searchDoctorAppointmentSchema
>['body'];
export type SearchDoctorAppointmentQueryInput = z.infer<
  typeof searchDoctorAppointmentSchema
>['query'];

export interface ISearchAppointmentQuery {
  doctor?: string;
  patient?: string;
  status?: AppointmentStatus;
  paid?: boolean;
  price?: number;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IUpdateAppointmentInput {
  status?: AppointmentStatus;
  paid?: boolean;
  price?: number;
  date?: Date;
}
