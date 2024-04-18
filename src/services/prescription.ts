import { FilterQuery } from 'mongoose';
import PrescriptionModel from '../models/prescription';
import {
  AddPrescriptionBodyInput,
  SearchPatientPrescriptionsBodyInput,
  SearchPatientPrescriptionsQueryInput,
} from '../schema/prescription';
import DoctorModel, { Doctor } from '../models/doctor';
import HttpException from '../models/errors';

export const findPrescriptionById = async (
  patientId: string,
  prescriptionId: string,
) => {
  const result = await PrescriptionModel.findById(prescriptionId).populate(
    'doctor',
    '-password',
  );
  if (!result || result.patient.toString() !== patientId) {
    throw new HttpException(404, 'Prescription not found', []);
  }
  return result;
};

export const findPrescriptionsBySearchTerm = async (
  body: SearchPatientPrescriptionsBodyInput,
  query: SearchPatientPrescriptionsQueryInput,
) => {
  const { searchTerm, page = 1, limit = 50 } = query;

  const filter: FilterQuery<Doctor> = { patient: body.auth.patientId };
  if (searchTerm) {
    filter.$text = { $search: searchTerm };
    const doctors = await DoctorModel.find(filter);
    const doctorIds = doctors.map((doctor) => doctor._id);
    filter.doctor = { $in: doctorIds };
  }

  const count = await PrescriptionModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);

  const prescriptions = await PrescriptionModel.find(filter)
    .populate('doctor', '-password')
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    length: prescriptions.length,
    prescriptions,
    totalPages,
    currentPage,
  };
};

export const createPrescription = async (body: AddPrescriptionBodyInput) => {
  await PrescriptionModel.create({
    ...body,
    doctor: body.auth.doctorId,
    patient: body.patientId,
  });
};
