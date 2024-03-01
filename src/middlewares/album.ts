import { FormParser } from '../utils/albumFormParser';
import { ImageUploader } from '../services/albumUploader';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/errors';

export const uploadAlbum = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const acceptedContentType = 'multipart/form-data';

    // check 'content-type' header stars with multipart/form-data
    // because 'content-type' header look like "multipart/form-data; boundary=..."

    const isAcceptedContentType =
      req.headers['content-type']?.startsWith(acceptedContentType);
    if (!isAcceptedContentType) {
      throw new HttpException(400, 'Invalid content', ['Content is incorrect']);
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 megabytes to bytes
    const form = new FormParser({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      allowEmptyFiles: false,
    });
    // parse form data

    const { fields, files } = await form.parse(req).catch((err: any) => {
      throw new HttpException(400, err.message, [err]);
    });
    let result = '';
    if (fields.description) {
      result = fields.description.join(', ');
    }
    // yala run🏃‍♂️
    // check `title` and `content` fields are strings
    // check `image` field is a file and is an image

    const imageFiles = Array.isArray(files.image) ? files.image : [files.image];

    const images = await Promise.all(
      imageFiles.map(async (imageFile: any) => {
        const isImage = imageFile?.mimetype?.startsWith('image/');
        if (!isImage) {
          throw new HttpException(400, 'Uploaded file is not an image.', [
            'Uploaded file is incorrect please upload image',
          ]);
        }
        if (!imageFile)
          throw new HttpException(400, 'Invalid Image File', [
            'imageFile is incorrect',
          ]);
        return await ImageUploader.upload(imageFile.filepath);
      }),
    );
    req.body.images = images;
    req.body.description = result;
    next();
  } catch (err: any) {
    next(err);
  }
};
