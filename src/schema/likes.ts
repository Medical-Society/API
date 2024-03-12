import { z } from 'zod';
import { zodObjectId } from './customZod';

export const LikePatientPostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
    })
    .strict(),
  params: z
    .object({
      id: zodObjectId,
    })
    .strict(),
});
  
export type LikePatientPostBodyInput = z.infer<
  typeof LikePatientPostSchema
>['body'];
export type LikePatientPostParamsInput = z.infer<
  typeof LikePatientPostSchema
>['params'];