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
import {
  createCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
} from '../schema/comment';
import { LikePatientPostSchema } from '../schema/likes';

const router = express.Router();

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
router.post(
  '/unlike/:postId',
  checkAuth,
  checkPatient,
  validateResource(LikePatientPostSchema),
  patientController.unlike,
);
router.delete(
  '/comments/:commentId',
  checkAuth,
  checkPatient,
  validateResource(deleteCommentSchema),
  patientController.deleteComment,
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
router.post(
  '/like/:postId',
  checkAuth,
  checkPatient,
  validateResource(LikePatientPostSchema),
  patientController.Like,
);
router.patch(
  '/comments/:commentId',
  checkAuth,
  checkPatient,
  validateResource(editCommentSchema),
  patientController.updateComment,
);
router.patch(
  '/updateMe',
  checkAuth,
  checkPatient,
  validateResource(updatePatientSchema),
  patientController.updateMe,
);

router.post(
  '/comments/:postId',
  checkAuth,
  checkPatient,
  validateResource(createCommentSchema),
  patientController.createComment,
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
router.delete(
  '/delete-my-account',
  checkAuth,
  checkPatient,
  validateResource(deleteMyAccountPatientSchema),
  patientController.deleteMyAccount,
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
