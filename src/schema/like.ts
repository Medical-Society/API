import { z } from 'zod';
import { zodObjectId } from './customZod';

export const LikePatientPostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  params: z
    .object({
      doctorId: zodObjectId,
      postId: zodObjectId,
    })
    .strict(),
});

export const GetLikesPostSchema = z.object({
  params: z.object({
    doctorId: zodObjectId,
    postId: zodObjectId,
  }),
});

export type GetLikesPostParamsInput = z.infer<
  typeof GetLikesPostSchema
>['params'];

export type LikePatientPostBodyInput = z.infer<
  typeof LikePatientPostSchema
>['body'];
export type LikePatientPostParamsInput = z.infer<
  typeof LikePatientPostSchema
>['params'];
