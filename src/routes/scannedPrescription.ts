import express from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkPatient } from '../middlewares/checkPatient';
import validateResource from '../middlewares/validateResource';
import * as scannedPrescriptionController from '../controllers/scannedPrescription';
// import { addScannedPrescriptionSchema ,} from '../schema/scannedPrescription';
import { upload } from '../middlewares/image';
import { uploadPrescription } from '../middlewares/uploadPrescription';
import { validAgeDate } from '../schema/customZod';
import { createScannedPrescriptionSchema } from '../schema/scannedPrescription';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    checkAuth,
    checkPatient,
    uploadPrescription,
    validateResource(createScannedPrescriptionSchema),
    scannedPrescriptionController.createScannedPrescriptionPatient,
  );

export default router;
