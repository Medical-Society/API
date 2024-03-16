import express from 'express';
import validateResource from '../middlewares/validateResource';
import {
  createPostSchema,
  deletePostSchema,
  getPostsSchema,
  updatePostSchema,
} from '../schema/post';
import * as postController from '../controllers/post';
import { checkAuth } from '../middlewares/checkAuth';
import { checkDoctor } from '../middlewares/checkDoctor';
import { uploadAlbum } from '../middlewares/album';

const router = express.Router({ mergeParams: true });

import commentRouter from './comment';

router.use('/:postId/comments',commentRouter);

router
  .route('/')
  .get(validateResource(getPostsSchema), postController.getDoctorPosts)
  .post(
    checkAuth,
    checkDoctor,
    uploadAlbum,
    validateResource(createPostSchema),
    postController.createPost,
  );

router
  .route('/:postId')
  .delete(
    checkAuth,
    checkDoctor,
    validateResource(deletePostSchema),
    postController.deletePost,
  )
  .patch(
    checkAuth,
    checkDoctor,
    uploadAlbum,
    validateResource(updatePostSchema),
    postController.updatePost,
  );

export default router;
