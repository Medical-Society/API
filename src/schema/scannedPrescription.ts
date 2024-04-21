import { zodObjectId } from './customZod';

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
export type CreateScannedPrescriptionBody = z.infer<
  typeof createScannedPrescriptionSchema
>['body'];
