import { NextFunction, Request, Response } from 'express';
import Patient from '../models/patient';
import HttpException from '../models/errors';

export const checkPatient = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await Patient.findById(req.body.auth.id);
    if (!patient) {
      throw new HttpException(
        401,
        'Unauthorized user. Patient access required.',
        [],
      );
    }
    if (!patient.isVerified) {
      throw new HttpException(403, 'You are not verified', []);
    }
    req.body.auth.patientId = patient._id;
    delete req.body.auth.id;
    next();
  } catch (err: any) {
    next(err);
  }
};
