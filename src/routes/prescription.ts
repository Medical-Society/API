import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import * as prescriptionController from '../controllers/prescription';
import {
  addPrescriptionSchema,
  getPrescriptionSchema,
  searchPatientPrescriptionsSchema,
} from '../schema/prescription';
import { checkDoctor } from '../middlewares/checkDoctor';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    checkAuth,
    validateResource(searchPatientPrescriptionsSchema),
    prescriptionController.getAllPrescriptions,
  )
  .post(
    checkAuth,
    checkDoctor,
    validateResource(addPrescriptionSchema),
    prescriptionController.addPrescription,
  );

router
  .route('/:prescriptionId')
  .get(
    checkAuth,
    checkPatient,
    validateResource(getPrescriptionSchema),
    prescriptionController.getPrescription,
  );

export default router;
