import { NextFunction, Request, Response } from 'express';
import Admin from '../models/admin';
import HttpException from '../models/errors';

export const checkAdmin = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const admin = await Admin.findById(req.body.auth.id);
    if (!admin) {
      throw new HttpException(
        401,
        'Unauthorized user. Admin access required.',
        ['Unauthorized'],
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
