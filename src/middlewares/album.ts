import { FormParser } from '../utils/albumFormParser';
import { ImageUploader } from '../services/albumUploader';
import { NextFunction, Request, Response } from 'express';

export const uploadAlbum = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

  const { fields,files} = await form.parse(req).catch((err:any) => {
    console.error(err);
    throw new Error();
  });
  let result = '';
  if (fields.description) {
    result = fields.description.join(', ');
    console.log('fields',res);
  }
  // yala run🏃‍♂️
  // check `title` and `content` fields are strings
  // check `image` field is a file and is an image    

  const imageFiles = Array.isArray(files.image) ? files.image : [files.image];
  

  const images = await Promise.all(
    imageFiles.map(async (imageFile:any) => {
      const isImage = imageFile?.mimetype?.startsWith('image/');
      if (!isImage) {
        throw new Error('Uploaded file is not an image.');
      }
      if (!imageFile) throw Error();
      return await ImageUploader.upload(imageFile.filepath);
    }),
  );
  console.log(images);
  req.body.images = images;
  req.body.description = result;
  next();
};
