import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpException from '../models/errors';

const key = process.env.JWT_SECRET as string;

export const checkAuth = (req: Request, _: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException(401, 'Please login first');
    }
    const decoded = jwt.verify(token, key) as JwtPayload;
    req.body.auth = { id: decoded._id };
    next();
  } catch (err: any) {
    next(err);
  }
};
