import { NextFunction, Request, Response } from 'express';

import HttpException from '../models/errors';
import {
  GetChatByIdSchemaBody,
  GetChatByIdSchemaParams,
  GetChatSchemaBody,
  GetChatSchemaQuery,
} from '../schema/chat';
import { getChatById, getChats } from '../services/chat';

export const getAllChatsForUser = async (
  req: Request<{}, {}, GetChatSchemaBody, GetChatSchemaQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getChats(req.body, req.query);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getChatUserById = async (
  req: Request<GetChatByIdSchemaParams, {}, GetChatByIdSchemaBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getChatById(req.body, req.params);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};
