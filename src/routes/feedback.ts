import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkDoctor } from '../middlewares/checkDoctor';
import validateResource from '../middlewares/validateResource';
import { addFeedbackSchema, getAllFeedbacksSchema } from '../schema/feedback';
import * as feedbackController from '../controllers/feedback';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    validateResource(getAllFeedbacksSchema),
    feedbackController.getAllFeedbacks,
  )
  .post(
    checkAuth,
    checkDoctor,
    validateResource(addFeedbackSchema),
    feedbackController.addFeedback,
  );

export default router;
