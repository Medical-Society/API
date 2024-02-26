import express from 'express';

import * as patientController from '../controllers/patient';

import validateResource from '../middlewares/validateResource';
import { checkAuth } from '../middlewares/checkAuth';
import { checkAdmin } from '../middlewares/checkAdmin';
import { checkPatient } from '../middlewares/checkPatient';
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

  } from '../schema/patient';
  

const router = express.Router();

//route for Admin
router.get(
  '/',
  checkAuth,
  checkAdmin,
  validateResource(getAllPatientSchema),
  patientController.getAllPatient,
);
router.get(
  '/:id',
  checkAuth,
  checkAdmin,
  validateResource(getPatientSchema),
  patientController.getPatient,
);
router.delete(
  '/delete/:id',
  checkAuth,
  checkAdmin,
  validateResource(deletePatientSchema),
  patientController.deletePatient,
);

//router for patient

router.post(
  '/signup',
  validateResource(signupPatientSchema),
  patientController.signUp,
);
router.get(
  '/verify/:token',
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
router.post(
  '/change-password',
  checkAuth,
  checkPatient,
  validateResource(changePasswordPatientSchema),
  patientController.changePassword,
);
router.delete(
  '/delete-my-account',
  checkAuth,
  checkPatient,
  validateResource(deleteMyAccountPatientSchema),
  patientController.deleteMyAccount,
);
export default router;
