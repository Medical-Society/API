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
} from '../schema/doctor';
import {
  createPostSchema,
  deletePostSchema,
  getPostsSchema,
  updatePostSchema,
} from '../schema/post';
import { checkPatient } from '../middlewares/checkPatient';
import { addReviewSchema, getReviewsSchema } from '../schema/review';
import { upload } from '../middlewares/image';
import { saveImageSchema } from '../schema/customZod';
import { uploadAlbum } from '../middlewares/album';
const router = express.Router();

router.post(
  '/avatar',
  checkAuth,
  checkDoctor,
  upload,
  validateResource(saveImageSchema),
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
router.post(
  '/:id/reviews',
  checkAuth,
  checkPatient,
  validateResource(addReviewSchema),
  doctorController.addReview,
);
router.get(
  '/:id/reviews',
  validateResource(getReviewsSchema),
  doctorController.getReviews,
);
router.get(
  '/',
  validateResource(searchDoctorSchema),
  doctorController.searchDoctor,
);
router.get(
  '/:id',
  validateResource(getDoctorSchema),
  doctorController.getDoctor,
);
//🎮
router.get(
  '/:id/posts',
  validateResource(getPostsSchema),
  doctorController.getDoctorPosts,
);
router.post(
  '/posts',
  checkAuth,
  checkDoctor,
  uploadAlbum,
  validateResource(createPostSchema),
  doctorController.createPost,
);
router.delete(
  '/posts/:id',
  checkAuth,
  checkDoctor,
  validateResource(deletePostSchema),
  doctorController.deletePost,
);
router.patch(
  '/update-post/:id',
  checkAuth,
  checkDoctor,
  uploadAlbum,
  validateResource(updatePostSchema),
  doctorController.updatePost,
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
  '/status/:id',
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
  '/:id',
  checkAuth,
  checkAdmin,
  validateResource(deleteDoctorSchema),
  doctorController.deleteDoctor,
);

export default router;
