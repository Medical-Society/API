import { FormParser } from '../utils/formParser';
import { ImageUploader } from '../services/imageUploader';
import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/errors';

export const upload = async (
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
      throw new HttpException(400, 'Invalid content', [
        'Content is not correct',
      ]);
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 megabytes to bytes
    const form = new FormParser({
      maxFileSize: MAX_FILE_SIZE,
      keepExtensions: true,
      allowEmptyFiles: false,
    });
    // parse form data

    const { files } = await form.parse(req).catch((err: any) => {
      throw new HttpException(400, err.message, [err]);
    });

    // check `title` and `content` fields are strings

    // check `image` field is a file and is an image

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const isImage = imageFile?.mimetype?.startsWith('image/');
    if (imageFile && !isImage) {
      throw new HttpException(400, 'Invalid Image File Or Image');
    }

    const image = imageFile
      ? await ImageUploader.upload(imageFile.filepath)
      : undefined;

    req.body.imageURL = image;
    next();
  } catch (err: any) {
    next(err);
  }
};
