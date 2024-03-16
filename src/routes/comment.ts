import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import {
  createCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
  getCommentSchema,
} from '../schema/comment';
import * as commentController from '../controllers/comment';

const router = express.Router({ mergeParams: true });

router.route('/').post(
  checkAuth,
  checkPatient,
  validateResource(createCommentSchema),
  commentController.createComment,
).get(validateResource(getCommentSchema),commentController.getComments);

router
  .route('/:commentId')
  .delete(
    checkAuth,
    checkPatient,
    validateResource(deleteCommentSchema),
    commentController.deleteComment,
  )
  .patch(
    checkAuth,
    checkPatient,
    validateResource(editCommentSchema),
    commentController.editComment,
  );
export default router;
