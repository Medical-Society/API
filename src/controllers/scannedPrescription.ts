import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/errors';
import { CreateScannedPrescriptionBody } from '../schema/scannedPrescription';
import { createScannedPrescription } from '../services/ScannedPrescription';

export const createScannedPrescriptionPatient = async (
  req: Request<{}, {}, CreateScannedPrescriptionBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const data = req.body.Medicines;
    const data = await createScannedPrescription(req.body.auth.patientId,req.body.medicines);

    res.status(200).json({
      status: 'success',
      data,
    });
    res.end();
  } catch (err: any) {
    next(err);
  }
};
