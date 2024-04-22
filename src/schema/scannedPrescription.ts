import { paginationQuery, validAgeDate, zodObjectId } from './customZod';

import { object, string, TypeOf, nativeEnum, z } from 'zod';

export const createScannedPrescriptionSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),

      medicines: z.array(z.string(), { required_error: 'Image is required' }),
    })
    .strict(),
});

export const updateScannedPrescriptionSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      medicines: z.array(
        z.object({
          name: z.string(),
          time: z.string().optional(),
          note: z.string().optional(),
        }),
      ),
      patientName: z.string().optional(),
      doctorName: z.string().optional(),
      birthdate: validAgeDate(0).optional(),
    })
    .strict(),
  params: z.object({
    scannedPrescriptionId: zodObjectId,
  }),
});

export const getScannedPrescriptionSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  query: z
    .object({
      searchTerm: z.string().optional(),
    })
    .merge(paginationQuery)
    .strict(),
});

export const getScannedPrescriptionByIdSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  params: z.object({
    scannedPrescriptionId: zodObjectId,
  }),
});

export type CreateScannedPrescriptionBody = z.infer<
  typeof createScannedPrescriptionSchema
>['body'];

export type UpdateScannedPrescriptionBody = z.infer<
  typeof updateScannedPrescriptionSchema
>['body'];
export type UpdateScannedPrescriptionParams = z.infer<
  typeof updateScannedPrescriptionSchema
>['params'];

export type GetScannedPrescriptionBody = z.infer<
  typeof getScannedPrescriptionSchema
>['body'];
export type GetScannedPrescriptionQuery = z.infer<
  typeof getScannedPrescriptionSchema
>['query'];

export type GetScannedPrescriptionByIdBody = z.infer<
  typeof getScannedPrescriptionByIdSchema
>['body'];
export type GetScannedPrescriptionByIdParams = z.infer<
  typeof getScannedPrescriptionByIdSchema
>['params'];
