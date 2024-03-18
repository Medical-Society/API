import { z } from 'zod';
import { zodObjectId } from './customZod';

export const bookAppointmentSchema = z.object({
  body: z.object({
    auth: z.object({
      patientId: zodObjectId,
    }),
    doctorId: zodObjectId,
    date: z.coerce.date(),
  }),
});

export type bookAppointmentBodyInput = z.infer<
  typeof bookAppointmentSchema
>['body'];
