import express from 'express';
import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import {
  bookAppointmentSchema,
  getAppointmentByIdSchema,
  getAppointmentsBeforeYouSchema,
} from '../schema/appointment';
import { searchPatientAppointmentSchema } from '../schema/appointment';
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
    validateResource(searchPatientAppointmentSchema),
    appointmentController.searchPatientAppointment,
  );

router
  .route('/:appointmentId')
  .get(
    checkAuth,
    checkPatient,
    validateResource(getAppointmentByIdSchema),
    appointmentController.getPatientAppointment,
  )
  .delete(
    checkAuth,
    checkPatient,
    validateResource(getAppointmentByIdSchema),
    appointmentController.cancelPatientAppointment,
  );
router
  .route('/:appointmentId/beforeYou')
  .get(
    validateResource(getAppointmentsBeforeYouSchema),
    appointmentController.getAppointmentsBeforeYouPatient,
  );
export default router;
