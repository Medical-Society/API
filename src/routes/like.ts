import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import { GetLikesPostSchema, LikePatientPostSchema } from '../schema/like';

import * as likeController from '../controllers/like';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    checkAuth,
    checkPatient,
    validateResource(LikePatientPostSchema),
    likeController.LikeOrUnlike,
  )
  .get(validateResource(GetLikesPostSchema), likeController.GetLikesOfPost);

export default router;
