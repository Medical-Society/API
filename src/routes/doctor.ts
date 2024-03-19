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
  getDoctorSchema,
  loginDoctorSchema,
  resetPasswordDoctorSchema,
  signupDoctorSchema,
  updateDoctorPasswordSchema,
  updateDoctorSchema,
  verifyDoctorSchema,
  searchDoctorSchema,
  saveDoctorAvatarSchema,
} from '../schema/doctor';
import { upload } from '../middlewares/image';
import reviewRouter from './review';
import postRouter from './post';
import availableTimeRouter from './availableTime';
import appointmentRouter from './appointment';

const router = express.Router();

router.use('/available-times', availableTimeRouter);
router.use('/:doctorId/reviews', reviewRouter);
router.use('/:doctorId/posts', postRouter);
router.use('/appointments', appointmentRouter);
router.post(
  '/avatar',
  checkAuth,
  checkDoctor,
  upload,
  validateResource(saveDoctorAvatarSchema),
  doctorController.saveProfileImage,
);
router.post(
  '/signup',
  validateResource(signupDoctorSchema),
  doctorController.signup,
);
router.post(
  '/login',
  validateResource(loginDoctorSchema),
  doctorController.login,
);
router.post(
  '/verify',
  validateResource(verifyDoctorSchema),
  doctorController.verifyEmail,
);
router.get(
  '/',
  validateResource(searchDoctorSchema),
  doctorController.searchDoctor,
);
router.get(
  '/:doctorId',
  validateResource(getDoctorSchema),
  doctorController.getDoctor,
);
router.post(
  '/forgot-password',
  validateResource(forgotPasswordDoctorSchema),
  doctorController.forgotPassword,
);
router.post(
  '/reset-password',
  validateResource(resetPasswordDoctorSchema),
  doctorController.resetPassword,
);
router.patch(
  '/',
  checkAuth,
  checkDoctor,
  validateResource(updateDoctorSchema),
  doctorController.update,
);
router.patch(
  '/status/:doctorId',
  checkAuth,
  checkAdmin,
  validateResource(changeDoctorStatusSchema),
  doctorController.changeStatus,
);
router.patch(
  '/password',
  checkAuth,
  checkDoctor,
  validateResource(updateDoctorPasswordSchema),
  doctorController.changePassword,
);
router.delete(
  '/',
  checkAuth,
  checkDoctor,
  validateResource(deleteMyAccountSchema),
  doctorController.deleteMyAccount,
);
router.delete(
  '/:doctorId',
  checkAuth,
  checkAdmin,
  validateResource(deleteDoctorSchema),
  doctorController.deleteDoctor,
);

export default router;
