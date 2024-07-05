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
import * as appointmentController from '../controllers/appointment';
import {
  updateAppointmentSchema,
  searchDoctorAppointmentSchema,
} from '../schema/appointment';
import prescriptionRouter from './prescription';
import feedbackRouter from './feedback';
import { uploadAlbum } from '../middlewares/album';

const router = express.Router();

router.use('/:doctorId/available-times', availableTimeRouter);
router.use('/:doctorId/reviews', reviewRouter);
router.use('/:doctorId/posts', postRouter);
router.use('/prescriptions', prescriptionRouter);
router.use('/feedbacks', feedbackRouter);

router.get(
  '/appointments',
  checkAuth,
  checkDoctor,
  validateResource(searchDoctorAppointmentSchema),
  appointmentController.searchDoctorAppointment,
);
router.patch(
  '/appointments/:appointmentId',
  checkAuth,
  checkDoctor,
  validateResource(updateAppointmentSchema),
  appointmentController.updateDoctorAppointment,
);
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
  checkAuth,
  uploadAlbum,
  validateResource(verifyDoctorSchema),
  doctorController.verifyDoctorInfo,
);
router.get(
  '/',
  checkAuth,
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
