import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import validateResource from '../middlewares/validateResource';
import {
  getAvailableTimes,
  updateAvailableTime,
} from '../controllers/availableTime';
import {
  getAvailableTimesSchema,
  updateAvailableTimeSchema,
} from '../schema/availableTime';
import { checkDoctor } from '../middlewares/checkDoctor';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(validateResource(getAvailableTimesSchema), getAvailableTimes)
  .patch(
    checkAuth,
    checkDoctor,
    validateResource(updateAvailableTimeSchema),
    updateAvailableTime,
  );

export default router;
