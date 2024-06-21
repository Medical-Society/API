import { NextFunction, Request, Response } from 'express';
import HttpException from '../models/errors';
import {
  CreateScannedPrescriptionBody,
  GetScannedPrescriptionBody,
  GetScannedPrescriptionByIdBody,
  GetScannedPrescriptionByIdParams,
  GetScannedPrescriptionParams,
  GetScannedPrescriptionQuery,
  UpdateScannedPrescriptionBody,
  UpdateScannedPrescriptionParams,
} from '../schema/scannedPrescription';
import {
  createScannedPrescription,
  deleteScannedPrescriptionById,
  getScannedPrescription,
  getScannedPrescriptionById,
  updateScannedPrescription,
} from '../services/ScannedPrescription';

export const createScannedPrescriptionPatient = async (
  req: Request<{}, {}, CreateScannedPrescriptionBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const data = req.body.Medicines;
    const data = await createScannedPrescription(
      req.body.auth.patientId,
      req.body.medicines,
    );

    res.status(200).json({
      status: 'success',
      data,
    });
    res.end();
  } catch (err: any) {
    next(err);
  }
};

export const updateScannedPrescriptionPatient = async (
  req: Request<
    UpdateScannedPrescriptionParams,
    {},
    UpdateScannedPrescriptionBody
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await updateScannedPrescription(
      req.params.scannedPrescriptionId,
      req.body,
    );
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getScannedPrescriptionPatient = async (
  req: Request<GetScannedPrescriptionParams, {}, GetScannedPrescriptionBody, GetScannedPrescriptionQuery>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getScannedPrescription(req.body, req.query, req.params);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const getScannedPrescriptionByIdPatient = async (
  req: Request<
    GetScannedPrescriptionByIdParams,
    {},
    GetScannedPrescriptionByIdBody
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await getScannedPrescriptionById(
      req.body.auth.patientId,
      req.params.scannedPrescriptionId,
    );
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteScannedPrescriptionPatient = async (
  req: Request<
    GetScannedPrescriptionByIdParams,
    {},
    GetScannedPrescriptionByIdBody
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteScannedPrescriptionById(
      req.body.auth.patientId,
      req.params.scannedPrescriptionId,
    );
    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
