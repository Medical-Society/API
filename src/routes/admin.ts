import express from 'express';

import * as adminController from '../controllers/admin';
import validateResource from '../middlewares/validateResource';
import { loginAdminSchema, signupAdminSchema } from '../schema/admin';

const router = express.Router();

// Define your admin routes here
router.post(
  '/login',
  validateResource(loginAdminSchema),
  adminController.login,
);
// router.post(
//   '/signup',
//   validateResource(signupAdminSchema),
//   adminController.signup,
// );

export default router;
