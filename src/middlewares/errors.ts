import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { z } from 'zod';
import HttpException from '../models/errors';

export default function errorHandler(
  err: any,
  _: Request,
  res: Response,
  _next: NextFunction,
) {
  const errObj = err instanceof HttpException ? err : new HttpException();
  console.log('Error Handler:', err);
  if (err instanceof z.ZodError) {
    errObj.statusCode = 400;
    errObj.message = 'Invalid data';
    errObj.errors = err.errors.map((err) => err.message);
    errObj.path = err.errors.map((err) => err.path.join('/'));
  } else if (err instanceof JsonWebTokenError) {
    errObj.statusCode = 401;
    errObj.message = 'Unauthorized';
    errObj.errors = [err.message];
  } else if (err instanceof SyntaxError) {
    errObj.statusCode = 400;
    errObj.message = 'Invalid JSON';
    errObj.errors = [err.message];
  } else if (err.code === 11000) {
    errObj.statusCode = 400;
    errObj.message = 'Duplicate field value entered';
    const keys = Object.keys(err.keyValue);
    errObj.errors = keys.map((key) => `${key} must be unique`);
  }
  res.status(errObj.statusCode).json(errObj);
}
