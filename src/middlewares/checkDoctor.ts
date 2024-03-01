import { Request, Response, NextFunction } from 'express';
import Doctor from '../models/doctor';
import HttpException from '../models/errors';

export const checkDoctor = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await Doctor.findById(req.body.auth.id);
    if (!doctor) {
      throw new HttpException(
        401,
        'Unauthorized user. Doctor access required.',
      );
    }
    if (!doctor.isVerified) {
      throw new HttpException(403, 'You are not verified');
    }
    if (doctor.status !== 'ACCEPTED') {
      throw new HttpException(403, 'Your account is not accepted yet');
    }
    next();
  } catch (err) {
    next(err);
  }
};
