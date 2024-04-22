import { FilterQuery } from 'mongoose';
import HttpException from '../models/errors';
import PatientModel from '../models/patient';
import ScannedPrescriptionModel, {
  ScannedPrescription,
} from '../models/scannedPrescription';
import {
  CreateScannedPrescriptionBody,
  GetScannedPrescriptionBody,
  GetScannedPrescriptionQuery,
  UpdateScannedPrescriptionBody,
} from '../schema/scannedPrescription';

export const createScannedPrescription = async (
  patientId: any,
  medicines: string[],
) => {
  const prescription = new ScannedPrescriptionModel();
  prescription.patient = patientId;
  medicines.forEach((el) => {
    const newMedicine = { name: el, time: '', note: '' };
    prescription.medicines.push(newMedicine);
  });
  prescription.save();
  return prescription;
};

export const updateScannedPrescription = async (
  scannedPrescriptionId: any,
  body: UpdateScannedPrescriptionBody,
) => {
  const scannedPrescription = await ScannedPrescriptionModel.findById(
    scannedPrescriptionId,
  );

  if (!scannedPrescription) {
    throw new HttpException(404, 'Prescription Not found', ['']);
  }
  if (!scannedPrescription.patient._id.equals(body.auth.patientId)) {
    throw new HttpException(
      404,
      'You are not allowed to Edit this Prescription',
      [''],
    );
  }
  const newPrescription = await ScannedPrescriptionModel.findByIdAndUpdate(
    scannedPrescriptionId,
    body,
  );
  return newPrescription;
};

export const getScannedPrescription = async (
  body: GetScannedPrescriptionBody,
  query: GetScannedPrescriptionQuery,
) => {
  const { searchTerm, page = 1, limit = 20 } = query;
  const filter: FilterQuery<ScannedPrescription> = {
    patient: body.auth.patientId,
  };
  if (searchTerm) {
    filter['$or'] = [
      { doctorName: { $regex: new RegExp(searchTerm, 'i') } },
      { patientName: { $regex: new RegExp(searchTerm, 'i') } },
      { 'medicines.name': { $regex: new RegExp(searchTerm, 'i') } },
      { 'medicines.time': { $regex: new RegExp(searchTerm, 'i') } },
      { 'medicines.note': { $regex: new RegExp(searchTerm, 'i') } },
    ];
  }
  console.log(filter);
  const count = await ScannedPrescriptionModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);

  const scannedPrescriptions = await ScannedPrescriptionModel.find(filter)
    .populate('patient', '-password')
    .skip(skip)
    .limit(limit)
    .exec();

  return {
    length: scannedPrescriptions.length,
    scannedPrescriptions,
    totalPages,
    currentPage,
  };
};

export const getScannedPrescriptionById = async (
  patientId: any,
  scannedPrescriptionId: any,
) => {
  const scannedPrescription = await ScannedPrescriptionModel.findById(
    scannedPrescriptionId,
  );
  if (!scannedPrescription) {
    throw new HttpException(404, 'This Prescription NOt exist', ['']);
  }
  if (!scannedPrescription.patient._id.equals(patientId)) {
    throw new HttpException(
      404,
      'You are not allowed to show this Prescription',
      [''],
    );
  }
  return scannedPrescription;
};

export const deleteScannedPrescriptionById = async (
  patientId: any,
  scannedPrescriptionId: any,
) => {
  const scannedPrescription = await ScannedPrescriptionModel.findById(
    scannedPrescriptionId,
  );
  if (!scannedPrescription) {
    throw new HttpException(404, 'This Prescription NOt exist', ['']);
  }
  if (!scannedPrescription.patient._id.equals(patientId)) {
    throw new HttpException(
      404,
      'You are not allowed to Delete this Prescription',
      [''],
    );
  }
  await ScannedPrescriptionModel.findByIdAndDelete(scannedPrescriptionId);
};
