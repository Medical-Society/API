import { z } from 'zod';
import { paginationQuery, zodObjectId } from './customZod';

export const addReviewSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      rating: z
        .number({ required_error: 'Rating is required' })
        .max(5, 'Max Rate is 5')
        .min(1, 'Minimum Rate is 1'),
      comment: z.string().optional(),
    })
    .strict(),
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
});

export const getAllReviewsSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
  query: z
    .object({
      patientId: zodObjectId.optional(),
    })
    .merge(paginationQuery),
});

export const getReviewSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
      reviewId: zodObjectId,
    })
    .strict(),
});

export const deleteReviewSchema = z.object({
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
      reviewId: zodObjectId,
    })
    .strict(),
});

export const updateReviewSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      rating: z.number().optional(),
      comment: z.string().optional(),
    })
    .strict(),
  params: z
    .object({
      doctorId: zodObjectId,
      reviewId: zodObjectId,
    })
    .strict(),
});

export type AddReviewBodyInput = z.infer<typeof addReviewSchema>['body'];

export type AddReviewParamsInput = z.infer<typeof addReviewSchema>['params'];

export type GetAllReviewsParamsInput = z.infer<
  typeof getAllReviewsSchema
>['params'];

export type GetAllReviewsQueryInput = z.infer<
  typeof getAllReviewsSchema
>['query'];

export type GetReviewParamsInput = z.infer<typeof getReviewSchema>['params'];

export type DeleteReviewBodyInput = z.infer<typeof deleteReviewSchema>['body'];

export type DeleteReviewParamsInput = z.infer<
  typeof deleteReviewSchema
>['params'];

export type UpdateReviewBodyInput = z.infer<typeof updateReviewSchema>['body'];

export type UpdateReviewParamsInput = z.infer<
  typeof updateReviewSchema
>['params'];
