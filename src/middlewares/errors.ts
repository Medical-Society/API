import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export default function errorHandler(
  err: Error | z.ZodError | any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  err.location = `${req.method} ${req.url}`;
  console.log('In standard error handler');
  const errObj = {
    status: 'error',
    errors: ['Internal Server Error'],
    message: 'Something went wrong',
    statusCode: 500,
  };
  if (err instanceof z.ZodError) {
    errObj.errors = err.errors.map((error) => error.message);
    errObj.message = 'Invalid Input';
    errObj.statusCode = 400;
  }
  if (err.code === 11000) {
    errObj.errors = ['email must be unique'];
    errObj.message = 'Account already exist';
    errObj.statusCode = 409;
  }
  if (err instanceof Error) {
    console.log(err);
  }
  return res.status(errObj.statusCode).json({ ...errObj, err });
}
