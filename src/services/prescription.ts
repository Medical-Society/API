import { FilterQuery } from 'mongoose';
import PrescriptionModel, { Prescription } from '../models/prescription';
import {
  AddPrescriptionBodyInput,
  AddPrescriptionParamsInput,
  SearchPatientPrescriptionsBodyInput,
  SearchPatientPrescriptionsParamsInput,
  SearchPatientPrescriptionsQueryInput,
} from '../schema/prescription';
import DoctorModel from '../models/doctor';
import HttpException from '../models/errors';
import PatientModel from '../models/patient';
import { isPatientWithDoctorNow } from './appointment';

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
  params: SearchPatientPrescriptionsParamsInput,
) => {
  const { searchTerm, page = 1, limit = 50 } = query;
  const doctor = await DoctorModel.findById(body.auth.id);
  const patient = await PatientModel.findById(body.auth.id);

  if (!doctor && !patient) {
    throw new HttpException(403, 'Forbidden', ['Forbidden']);
  }
  if (
    doctor &&
    !(await isPatientWithDoctorNow(params.patientId, body.auth.id))
  ) {
    throw new HttpException(403, 'doctor can not see prescription', [
      'Forbidden',
    ]);
  }
  if (patient) {
    params.patientId = body.auth.id;
  }
  const filter: FilterQuery<Prescription> = { patient: params.patientId };

  if (searchTerm) {
    const doctor = await DoctorModel.find({
      $or: [
        { englishFullName: { $regex: new RegExp(searchTerm, 'i') } },
        { specialization: { $regex: new RegExp(searchTerm, 'i') } },
        { clinicAddress: { $regex: new RegExp(searchTerm, 'i') } },
      ],
    });
    // diseases, diagnose, medicines
    filter['$or'] = [
      { diseases: { $regex: new RegExp(searchTerm, 'i') } },
      { diagnose: { $regex: new RegExp(searchTerm, 'i') } },
      {
        medicines: {
          $elemMatch: { name: { $regex: new RegExp(searchTerm, 'i') } },
        },
      },
      { doctor: { $in: doctor.map((d) => d._id) } },
    ];
  }

  const count = await PrescriptionModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);

  const prescriptions = await PrescriptionModel.find(filter)
    .populate('doctor', '-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();

  return {
    length: prescriptions.length,
    prescriptions,
    totalPages,
    currentPage,
  };
};

export const createPrescription = async (
  body: AddPrescriptionBodyInput,
  params: AddPrescriptionParamsInput,
) => {
  await PrescriptionModel.create({
    ...body,
    doctor: body.auth.doctorId,
    patient: params.patientId,
  });
};
