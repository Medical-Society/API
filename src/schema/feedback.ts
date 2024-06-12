import { z } from 'zod';
import { paginationQuery, zodObjectId } from './customZod';

export const addFeedbackSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      rating: z
        .number({ required_error: 'Rating is required' })
        .max(5, 'Max Rate is 5')
        .min(1, 'Minimum Rate is 1'),
      comment: z.string().optional(),
    })
    .strict(),
});

export const getAllFeedbacksSchema = z.object({});

export type AddFeedbackBodyInput = z.infer<typeof addFeedbackSchema>['body'];
