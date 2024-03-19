import express from 'express';
import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import {
  bookAppointmentSchema,
  getAppointmentSchema,
  searchAppointmentSchema,
} from '../schema/appointment';
import * as appointmentController from '../controllers/appointment';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    checkAuth,
    checkPatient,
    validateResource(bookAppointmentSchema),
    appointmentController.bookPatientAppointment,
  )
  .get(
    checkAuth,
    checkPatient,
    validateResource(searchAppointmentSchema),
    appointmentController.searchPatientAppointment,
  );

router
  .route('/:appointmentId')
  .get(
    checkAuth,
    checkPatient,
    validateResource(getAppointmentSchema),
    appointmentController.getPatientAppointment,
  );

export default router;
