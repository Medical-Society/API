import { z } from 'zod';
import { paginationQuery, zodObjectId } from './customZod';

export const searchPatientPrescriptionsSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
    })
    .strict(),
  query: z
    .object({
      searchTerm: z.string().optional(),
    })
    .merge(paginationQuery)
    .strict(),
  params: z
    .object({
      patientId: zodObjectId,
    })
    .strict(),
});

export const getPrescriptionSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  params: z
    .object({
      prescriptionId: zodObjectId,
      patientId: zodObjectId,
    })
    .strict(),
});

export const addPrescriptionSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      diseases: z.string(),
      diagnose: z.string(),
      medicines: z.array(
        z.object({
          name: z.string(),
          time: z.string(),
          note: z.string().optional(),
        }),
      ),
    })
    .strict(),
  params: z
    .object({
      patientId: zodObjectId,
    })
    .strict(),
});

export type SearchPatientPrescriptionsBodyInput = z.infer<
  typeof searchPatientPrescriptionsSchema
>['body'];

export type SearchPatientPrescriptionsQueryInput = z.infer<
  typeof searchPatientPrescriptionsSchema
>['query'];

export type SearchPatientPrescriptionsParamsInput = z.infer<
  typeof searchPatientPrescriptionsSchema
>['params'];

export type GetPrescriptionParamsInput = z.infer<
  typeof getPrescriptionSchema
>['params'];

export type GetPrescriptionBodyInput = z.infer<
  typeof getPrescriptionSchema
>['body'];

export type AddPrescriptionBodyInput = z.infer<
  typeof addPrescriptionSchema
>['body'];

export type AddPrescriptionParamsInput = z.infer<
  typeof addPrescriptionSchema
>['params'];
