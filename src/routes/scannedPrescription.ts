import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import * as scannedPrescriptionController from '../controllers/scannedPrescription';
import { uploadPrescription } from '../middlewares/uploadPrescription';
import {
  createScannedPrescriptionSchema,
  getScannedPrescriptionByIdSchema,
  getScannedPrescriptionSchema,
  updateScannedPrescriptionSchema,
} from '../schema/scannedPrescription';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    checkAuth,
    checkPatient,
    uploadPrescription,
    validateResource(createScannedPrescriptionSchema),
    scannedPrescriptionController.createScannedPrescriptionPatient,
  )
  .get(
    checkAuth,
    checkPatient,
    validateResource(getScannedPrescriptionSchema),
    scannedPrescriptionController.getScannedPrescriptionPatient,
  );
router
  .route('/:scannedPrescriptionId')
  .patch(
    checkAuth,
    checkPatient,
    validateResource(updateScannedPrescriptionSchema),
    scannedPrescriptionController.updateScannedPrescriptionPatient,
  )
  .get(
    checkAuth,
    checkPatient,
    validateResource(getScannedPrescriptionByIdSchema),
    scannedPrescriptionController.getScannedPrescriptionByIdPatient,
  )
  .delete(
    checkAuth,
    checkPatient,
    validateResource(getScannedPrescriptionByIdSchema),
    scannedPrescriptionController.deleteScannedPrescriptionPatient,
  );

export default router;
