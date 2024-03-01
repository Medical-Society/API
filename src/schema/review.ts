import { z } from 'zod';
import { zodObjectId } from './customZod';

export const addReviewSchema = z.object({
  body: z.object({
    auth: z.object({
      id: zodObjectId,
    }),
    rating: z.number({ required_error: 'Rating is required' }),
    comment: z.string().optional(),
  }),
  params: z.object({
    id: zodObjectId,
  }),
});

export const getReviewsSchema = z.object({
  params: z.object({
    id: zodObjectId,
  }),
});

export type AddReviewBodyInput = z.infer<typeof addReviewSchema>['body'];
export type AddReviewParamsInput = z.infer<typeof addReviewSchema>['params'];

export type GetReviewsInput = z.infer<typeof getReviewsSchema>['params'];
