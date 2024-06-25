import { z } from 'zod';
import { paginationQuery, zodObjectId } from './customZod';

export const getChatSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
    })
    .strict(),
  query: paginationQuery.strict(),
});

export const getChatByIdSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
    })
    .strict(),

  params: z
    .object({
      chatId: zodObjectId,
    })
    .strict(),
});

export type GetChatSchemaBody = z.infer<typeof getChatSchema>['body'];
export type GetChatSchemaQuery = z.infer<typeof getChatSchema>['query'];

export type GetChatByIdSchemaBody = z.infer<typeof getChatByIdSchema>['body'];
export type GetChatByIdSchemaParams = z.infer<typeof getChatByIdSchema>['params'];

