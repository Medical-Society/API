import { z } from 'zod';
import { zodObjectId } from './customZod';

export const createCommentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      text: z.string(),
    })
    .strict(),
  params: z
    .object({
      postId: zodObjectId,
    })
    .strict(),
});
export const deleteCommentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
    })
    .strict(),
  params: z
    .object({
      commentId: zodObjectId,
    })
    .strict(),
});

export const editCommentSchema = z.object({
  body: z
    .object({
      auth: z.object({
        patientId: zodObjectId,
      }),
      text: z.string({ required_error: 'text required' }),
    })
    .strict(),
  params: z
    .object({
      commentId: zodObjectId,
    })
    .strict(),
});

export type CreateCommentBodyInput = z.infer<
  typeof createCommentSchema
>['body'];
export type CreateCommentParamsInput = z.infer<
  typeof createCommentSchema
>['params'];

export type DeleteCommentBodyInput = z.infer<
  typeof deleteCommentSchema
>['body'];
export type DeleteCommentParamsInput = z.infer<
  typeof deleteCommentSchema
>['params'];

export type EditCommentBodyInput = z.infer<typeof editCommentSchema>['body'];
export type EditCommentParamsInput = z.infer<
  typeof editCommentSchema
>['params'];
