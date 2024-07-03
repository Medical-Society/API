import { FilterQuery, ProjectionType } from 'mongoose';
import PatientModel, { Patient } from '../models/patient';
import CommentModel from '../models/comment';
import HttpException from '../models/errors';
import { GetAllPatientInput } from '../schema/patient';
import LikeModel from '../models/like';
import AppointmentModel from '../models/appointment';
import ReviewModel from '../models/review';
import PrescriptionModel from '../models/prescription';
import ScannedPrescriptionModel from '../models/scannedPrescription';

export const findPatientByEmail = (email: string) => {
  return PatientModel.findOne({ email });
};

export const createPatient = (patient: any) => {
  return PatientModel.create(patient);
};

export const findPatientById = (
  id: string,
  projection: ProjectionType<Patient> = {},
) => {
  return PatientModel.findById(id, projection);
};

export const findPatientsPagination = async (
  filter: FilterQuery<Patient>,
  query: GetAllPatientInput,
) => {
  const { page = 1, limit = 10 } = query;
  const count = await PatientModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const patients = await PatientModel.find(
    {},
    { password: 0 },
    { limit, skip, sort: { createdAt: -1 } },
  );

  return {
    length: patients.length,
    patients,
    totalPages,
    currentPage,
  };
};

export const findPatientByIdAndUpdate = (
  id: string,
  update: any,
  options: any = { new: true },
) => {
  return PatientModel.findByIdAndUpdate(id, update, options);
};

export const findPatientByIdAndDelete = async (patientId: any) => {
  const patient = await PatientModel.findById(patientId);
  if (!patient) {
    throw new HttpException(400, 'Patient not Found', [
      'patient does not exist',
    ]);
  }
  await CommentModel.deleteMany({ patient: patientId });
  await LikeModel.deleteMany({ patient: patientId });
  await ReviewModel.deleteMany({ patient: patientId });
  await AppointmentModel.deleteMany({ patient: patientId });
  await PrescriptionModel.deleteMany({ patient: patientId });
  await ScannedPrescriptionModel.deleteMany({ patient: patientId });
  await PatientModel.findByIdAndDelete(patientId);
};
