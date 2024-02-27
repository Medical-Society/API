import { Request, Response } from 'express';
import { ImageUploader } from '../services/imageUploader'; // Assuming the service file is named imageUploader.ts

export async function uploadImageController(req: Request, res: Response): Promise<void> {
  try {
    const { imagePath } = req.body; // Assuming imagePath is sent in the request body
    const imageUrl = await ImageUploader.upload(imagePath);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Error uploading image' });
  }
}
