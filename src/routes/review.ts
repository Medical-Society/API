import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import {
  addReviewSchema,
  deleteReviewSchema,
  getAllReviewsSchema,
  getReviewSchema,
  updateReviewSchema,
} from '../schema/review';
import * as reviewController from '../controllers/review';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    checkAuth,
    checkPatient,
    validateResource(addReviewSchema),
    reviewController.addReview,
  )
  .get(validateResource(getAllReviewsSchema), reviewController.getAllReviews);

router
  .route('/:reviewId')
  .get(validateResource(getReviewSchema), reviewController.getReview)
  .delete(
    checkAuth,
    checkPatient,
    validateResource(deleteReviewSchema),
    reviewController.deleteReview,
  )
  .patch(
    checkAuth,
    checkPatient,
    validateResource(updateReviewSchema),
    reviewController.updateReview,
  );

export default router;
