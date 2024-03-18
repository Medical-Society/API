import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
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
  .get(
    checkAuth,
    checkPatient,
    validateResource(getAvailableTimesSchema),
    getAvailableTimes,
  )
  .patch(
    checkAuth,
    checkDoctor,
    validateResource(updateAvailableTimeSchema),
    updateAvailableTime,
  );

export default router;
