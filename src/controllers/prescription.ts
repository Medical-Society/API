import { NextFunction, Request, Response } from 'express';
import {
  AddPrescriptionBodyInput,
  GetPrescriptionBodyInput,
  GetPrescriptionParamsInput,
  SearchPatientPrescriptionsBodyInput,
  SearchPatientPrescriptionsQueryInput,
} from '../schema/prescription';
import {
  createPrescription,
  findPrescriptionById,
  findPrescriptionsBySearchTerm,
} from '../services/prescription';
import { isPatientWithDoctorNow } from '../services/appointment';
import HttpException from '../models/errors';

export const getAllPrescriptions = async (
  req: Request<
    {},
    {},
    SearchPatientPrescriptionsBodyInput,
    SearchPatientPrescriptionsQueryInput
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const results = await findPrescriptionsBySearchTerm(req.body, req.query);
    return res.status(200).json({
      status: 'success',
      data: results,
    });
  } catch (err: any) {
    next(err);
  }
};

export const addPrescription = async (
  req: Request<{}, {}, AddPrescriptionBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const canAdd = await isPatientWithDoctorNow(
      req.body.patientId,
      req.body.auth.doctorId,
    );
    if (!canAdd) {
      throw new HttpException(
        403,
        'You are not allowed to create a prescription for the patient now!',
        ['the patient is not with you now'],
      );
    }
    await createPrescription(req.body);
    return res.status(201).json({
      status: 'success',
      data: { message: 'Prescription created successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPrescription = async (
  req: Request<GetPrescriptionParamsInput, {}, GetPrescriptionBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const prescription = await findPrescriptionById(
      req.body.auth.patientId,
      req.params.prescriptionId,
    );
    return res.status(200).json({
      status: 'success',
      data: prescription,
    });
  } catch (err: any) {
    next(err);
  }
};
