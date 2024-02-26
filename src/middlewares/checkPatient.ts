import { NextFunction, Request, Response } from 'express';
import Patient from '../models/patient';

export const checkPatient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const patient = await Patient.findById(req.body.auth.id);
    //     console.log(patient);
    if (!patient) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Patient not found' });
    }
    next();
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({
      status: 'fail',
      error: err.message,
      message: 'Error in checking Patient',
    });
  }
};
