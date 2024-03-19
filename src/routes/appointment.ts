import express from 'express';
import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import {
  bookAppointmentSchema,
  changeAppointmentStatusSchema,
  getAppointmentByIdSchema,
} from '../schema/appointment';
import { searchAppointmentSchema } from '../schema/appointment';
import * as appointmentController from '../controllers/appointment';
import { checkDoctor } from '../middlewares/checkDoctor';

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
    validateResource(getAppointmentByIdSchema),
    appointmentController.getPatientAppointment,
  )
  .delete(
    checkAuth,
    checkPatient,
    validateResource(getAppointmentByIdSchema),
    appointmentController.cancelPatientAppointment,
  )
  .patch(
    checkAuth,
    checkDoctor,
    validateResource(changeAppointmentStatusSchema),
    appointmentController.changeDoctorAppointmentStatus,
  );

export default router;
