import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import validateResource from '../middlewares/validateResource';
import { getChatByIdSchema, getChatSchema } from '../schema/chat';
import * as chatController from '../controllers/chat';

const router = express.Router();

router
  .route('/')
  .get(
    checkAuth,
    validateResource(getChatSchema),
    chatController.getAllChatsForUser,
  );

router
  .route('/:chatId')
  .get(
    checkAuth,
    validateResource(getChatByIdSchema),
    chatController.getChatUserById,
  );
export default router;
