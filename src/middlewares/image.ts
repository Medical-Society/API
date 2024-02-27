import { FormParser } from '../utils/formParser';
import { ImageUploader } from '../services/imageUploader';
import { NextFunction, Request, Response } from 'express';

export const upload = async (req: Request, res: Response,next:NextFunction) => {
  const acceptedContentType = 'multipart/form-data';

  // check 'content-type' header stars with multipart/form-data
  // because 'content-type' header look like "multipart/form-data; boundary=..."

  const isAcceptedContentType =
    req.headers['content-type']?.startsWith(acceptedContentType);
  if (!isAcceptedContentType) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid content',
    });
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 megabytes to bytes
  const form = new FormParser({
    maxFileSize: MAX_FILE_SIZE,
    keepExtensions: true,
    allowEmptyFiles: false,
  });
  // parse form data

  const {  files } = await form.parse(req).catch((err) => {
    console.error(err);
    throw new Error();
  });

  // check `title` and `content` fields are strings

  // check `image` field is a file and is an image

  const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
  const isImage = imageFile?.mimetype?.startsWith('image/');
  if (imageFile && !isImage) {
    throw new Error();
  }
  console.log(imageFile);
  const image = imageFile
    ? await ImageUploader.upload(imageFile.filepath)
    : undefined;

  req.body.imageURL = image ;
  next();
};
