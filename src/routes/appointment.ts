import express from 'express';
import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import { bookAppointmentSchema } from '../schema/appointment';
import * as appointmentController from '../controllers/appointment';

const router = express.Router({ mergeParams: true });

router.post('/',checkAuth,checkPatient,validateResource(bookAppointmentSchema),appointmentController.bookPatientAppointment)

export default router;
