import { NextFunction, Request, Response } from 'express';
import Patient from '../models/patient';
import HttpException from '../models/errors';

export const checkPatient = async (
  req: Request,
  _res:Response,
  next: NextFunction,
) => {
  try {
    const patient = await Patient.findById(req.body.auth.id);
    if (!patient) {
      throw new HttpException(400, 'Patient not Found', [
        'patient does not exist',
      ]);
    }
    next();
  } catch (err: any) {
    next(err);
  }
};
