import { z } from 'zod';
import { zodObjectId } from './customZod';

export const addReviewSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      rating: z.number({ required_error: 'Rating is required' }),
      comment: z.string().optional(),
    })
    .strict(),
  params: z.object({
    id: zodObjectId,
  }),
});

export const getReviewsSchema = z.object({
  params: z.object({
    id: zodObjectId,
  }),
  query: z
    .object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
    })
    .strict(),
});

export type AddReviewBodyInput = z.infer<typeof addReviewSchema>['body'];

export type AddReviewParamsInput = z.infer<typeof addReviewSchema>['params'];

export type GetReviewsParamsInput = z.infer<typeof getReviewsSchema>['params'];

export type GetReviewsQueryInput = z.infer<typeof getReviewsSchema>['query'];
