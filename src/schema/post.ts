import { z } from 'zod';
import { zodObjectId } from './customZod';

export const createPostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      description: z.string({ required_error: 'Description is required' }),
      images: z.array(z.string()).optional(),
    })
    .strict(),
});

export const deletePostSchema = z.object({
  body: z.object({
    auth: z.object({
      id: zodObjectId,
    }),
  }),
  params: z.object({
    id: zodObjectId,
  }),
});

export const getPostsSchema = z.object({
  params: z
    .object({
      id: zodObjectId,
    })
    .strict(),
  query: z
    .object({
      limit: z.coerce.number().optional(),
      page: z.coerce.number().optional(),
    })
    .strict(),
});

export const updatePostSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .strict(),
  params: z.object({
    id: zodObjectId,
  }),
});

export type GetPostsParamsInput = z.infer<typeof getPostsSchema>['params'];
export type GetPostsQueryInput = z.infer<typeof getPostsSchema>['query'];
export type CreatePostInput = z.infer<typeof createPostSchema>['body'];
export type DeletePostBodyInput = z.infer<typeof deletePostSchema>['body'];
export type DeletePostParamsInput = z.infer<typeof deletePostSchema>['params'];

export type UpdatePostBodyInput = z.infer<typeof updatePostSchema>['body'];
export type UpdatePostParamsInput = z.infer<typeof updatePostSchema>['params'];
