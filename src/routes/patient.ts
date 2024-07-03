import express from 'express';

import * as patientController from '../controllers/patient';

import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { checkPatient } from '../middlewares/checkPatient';
import { upload } from '../middlewares/image';
import {
  getAllPatientSchema,
  getPatientSchema,
  deletePatientSchema,
  signupPatientSchema,
  loginPatientSchema,
  verifyEmailPatientSchema,
  updatePatientSchema,
  resetPasswordPatientSchema,
  forgotPasswordPatientSchema,
  changePasswordPatientSchema,
  deleteMyAccountPatientSchema,
  myInfoPatientSchema,
  savePatientAvatarSchema,
} from '../schema/patient';
import appointmentRouter from './appointment';
import prescriptionRouter from './prescription';
import scannedPrescriptionRouter from './scannedPrescription';
const router = express.Router();
router.use('/appointments', appointmentRouter);
router.use('/:patientId/prescriptions', prescriptionRouter);
router.use('/:patientId/scanned-prescriptions', scannedPrescriptionRouter);

//route for Admin
router.get(
  '/',
  checkAuth,
  checkAdmin,
  validateResource(getAllPatientSchema),
  patientController.getAllPatient,
);
//router for patient
router.get(
  '/myinfo',
  checkAuth,
  checkPatient,
  validateResource(myInfoPatientSchema),
  patientController.myInfo,
);

router.get(
  '/:patientId',
  checkAuth,
  checkAdmin,
  validateResource(getPatientSchema),
  patientController.getPatient,
);
router.delete(
  '/delete-my-account',
  checkAuth,
  checkPatient,
  validateResource(deleteMyAccountPatientSchema),
  patientController.deleteMyAccount,
);

router.delete(
  '/:patientId',
  checkAuth,
  checkAdmin,
  validateResource(deletePatientSchema),
  patientController.deletePatient,
);

router.post(
  '/signup',
  validateResource(signupPatientSchema),
  patientController.signUp,
);
router.post(
  '/verify',
  validateResource(verifyEmailPatientSchema),
  patientController.verifyEmail,
);
router.post(
  '/login',
  validateResource(loginPatientSchema),
  patientController.login,
);

router.patch(
  '/updateMe',
  checkAuth,
  checkPatient,
  validateResource(updatePatientSchema),
  patientController.updateMe,
);

router.post(
  '/reset-password',
  validateResource(resetPasswordPatientSchema),
  patientController.resetPassword,
);
router.post(
  '/forgot-password',
  validateResource(forgotPasswordPatientSchema),
  patientController.forgotPassword,
);
router.patch(
  '/password',
  checkAuth,
  checkPatient,
  validateResource(changePasswordPatientSchema),
  patientController.changePassword,
);

router.post(
  '/avatar',
  checkAuth,
  checkPatient,
  upload,
  validateResource(savePatientAvatarSchema),
  patientController.saveProfileImage,
);

export default router;
