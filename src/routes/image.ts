import express from 'express';
import { uploadImageController } from '../controllers/image';

const router = express.Router();

// Define route for uploading image
router.post('/upload', uploadImageController);

export default router;
