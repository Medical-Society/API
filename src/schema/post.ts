import { z } from 'zod';
import { zodObjectId } from './customZod';

export const createPostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      description: z.string({ required_error: 'Description is required' }),
      images: z.array(z.string()).optional(),
    })
    .strict(),
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
});

export const deletePostSchema = z.object({
  body: z.object({
    auth: z.object({
      doctorId: zodObjectId,
    }),
  }),
  params: z.object({
    doctorId: zodObjectId,
    postId: zodObjectId,
  }),
});

export const getPostsSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
  query: z
    .object({
      page: z.coerce.number().min(1, 'Page must be at least 1').optional(),
      limit: z.coerce.number().min(1, 'Limit must be at least 1').optional(),
    })
    .strict(),
});

export const updatePostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .strict(),
  params: z.object({
    doctorId: zodObjectId,
    postId: zodObjectId,
  }),
});

export type GetPostsParamsInput = z.infer<typeof getPostsSchema>['params'];
export type GetPostsQueryInput = z.infer<typeof getPostsSchema>['query'];
export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type CreatePostParamsInput = z.infer<typeof createPostSchema>['params'];
export type DeletePostBodyInput = z.infer<typeof deletePostSchema>['body'];
export type DeletePostParamsInput = z.infer<typeof deletePostSchema>['params'];

export type UpdatePostBodyInput = z.infer<typeof updatePostSchema>['body'];
export type UpdatePostParamsInput = z.infer<typeof updatePostSchema>['params'];
