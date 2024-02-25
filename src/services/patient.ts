import { FilterQuery, ProjectionType } from 'mongoose';
import PatientModel, { Patient } from '../models/patient';

export const findPatientByEmail = (email: string) => {
  return PatientModel.findOne({ email });
};

export const createPatient = (patinet: any) => {
  return PatientModel.create(patinet);
};
export const findPatientById = (
  id: string,
  projection?: ProjectionType<Patient>,
) => {
  return PatientModel.findById(id, projection);
};
export const findpatientsPagination = async (
  fileter: FilterQuery<Patient>,
  pageS: string = '1',
  limitS: string = '20',
) => {
  const limit = parseInt(limitS);
  const count = await PatientModel.countDocuments(fileter);
  const totalPages = Math.ceil(count / limit);
  const page = Math.min(totalPages, parseInt(pageS));
  return {
    patients: await PatientModel.find(
      {},
      { password: 0 },
      { limit, skip: (page - 1) * limit, sort: { createdAt: -1 } },
    ),
    totalPages,
    currentPage: page,
  };
};

export const findPatientByIdAndUpdate = (
  id: string,
  update: any,
  options: any = { new: true },
) => {
  return PatientModel.findByIdAndUpdate(id, update, options);
};

export const findPatientByIdAndDelete = (id: string) => {
  return PatientModel.findByIdAndDelete(id);
};
