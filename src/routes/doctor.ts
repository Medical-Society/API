import express from 'express';

// controllers
import * as doctorController from '../controllers/doctor';

// middlewares
import { checkAuth } from '../middlewares/checkAuth';
import { checkDoctor } from '../middlewares/checkDoctor';
import { checkAdmin } from '../middlewares/checkAdmin';
import validateResource from '../middlewares/validateResource';
import {
  changeDoctorStatusSchema,
  deleteDoctorSchema,
  deleteMyAccountSchema,
  forgotPasswordDoctorSchema,
  getAllDoctorsSchema,
  getDoctorSchema,
  loginDoctorSchema,
  resetPasswordDoctorSchema,
  signupDoctorSchema,
  updateDoctorPasswordSchema,
  updateDoctorSchema,
  verifyDoctorSchema,
} from '../schema/doctor';

const router = express.Router();

router.post(
  '/signup',
  validateResource(signupDoctorSchema),
  doctorController.signup
);
router.post(
  '/login',
  validateResource(loginDoctorSchema),
  doctorController.login
);
router.get(
  '/verify/:token',
  validateResource(verifyDoctorSchema),
  doctorController.verifyEmail
);
router.get(
  '/',
  validateResource(getAllDoctorsSchema),
  doctorController.getAllDoctors
);
router.get(
  '/:id',
  validateResource(getDoctorSchema),
  doctorController.getDoctor
);
router.post(
  '/forgot-password',
  validateResource(forgotPasswordDoctorSchema),
  doctorController.forgotPassword
);
router.post(
  '/reset-password',
  validateResource(resetPasswordDoctorSchema),
  doctorController.resetPassword
);
router.patch(
  '/',
  checkAuth,
  checkDoctor,
  validateResource(updateDoctorSchema),
  doctorController.update
);
router.patch(
  '/status/:id',
  checkAuth,
  checkAdmin,
  validateResource(changeDoctorStatusSchema),
  doctorController.changeStatus
);
router.patch(
  '/password',
  checkAuth,
  checkDoctor,
  validateResource(updateDoctorPasswordSchema),
  doctorController.changePassword
);
router.delete(
  '/',
  checkAuth,
  checkDoctor,
  validateResource(deleteMyAccountSchema),
  doctorController.deleteMyAccount
);
router.delete(
  '/:id',
  checkAuth,
  checkAdmin,
  validateResource(deleteDoctorSchema),
  doctorController.deleteDoctor
);

export default router;
