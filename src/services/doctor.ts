import { FilterQuery, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';
import ReviewModel from '../models/review';
import PatientModel from '../models/patient';

export const findDoctorByEmail = (email: string) => {
  return DoctorModel.findOne({ email });
};

export const createDoctor = (doctor: any) => {
  return DoctorModel.create(doctor);
};

export const findDoctorById = (
  id: string,
  projection?: ProjectionType<Doctor>,
) => {
  return DoctorModel.findById(id, projection);
};

export const findDoctorsPagination = async (
  filter: FilterQuery<Doctor>,
  page: number = 1,
  limit: number = 20,
) => {
  const count = await DoctorModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const skip = (page - 1) * limit;
  return {
    doctors: await DoctorModel.find(
      {},
      { password: 0 },
      { limit, skip, sort: { createdAt: -1 } },
    ),
    totalPages,
    currentPage: page,
  };
};

export const findDoctorByIdAndUpdate = (
  id: string,
  update: any,
  options: any = { new: true },
) => {
  return DoctorModel.findByIdAndUpdate(id, update, options);
};

export const findDoctorByIdAndDelete = (id: string) => {
  return DoctorModel.findByIdAndDelete(id);
};

export const findDoctor = async (
  filter: FilterQuery<Doctor>,
  englishFullName: string = '',
  specialization: string = '',
  clinicAddress: string = '',
  pageS: string = '1',
  limitS: string = '20',
) => {
  console.log(specialization, englishFullName, clinicAddress);

  if (englishFullName) {
    filter['englishFullName'] = { $regex: new RegExp(englishFullName, 'i') };
    // filter['englishFullName'] = englishFullName;
  }

  if (specialization) {
    filter['specialization'] = { $regex: new RegExp(specialization) };
  }
  if (clinicAddress) {
    filter['clinicAddress'] = { $regex: new RegExp(clinicAddress, 'i') };
  }
  const limit = parseInt(limitS);
  const count = await DoctorModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const page = Math.min(totalPages, parseInt(pageS));
  const skip = (page - 1) * limit;
  return {
    doctors: await DoctorModel.find(filter).skip(skip).limit(limit).exec(),
    totalPages,
    currentPage: page,
  };
};

export const addReviewForDoctorById = async (
  doctorId: string,
  patientId: string,
  reviewObj: any,
) => {
  const patient = await PatientModel.findById(patientId);
  const doctor = await DoctorModel.findById(doctorId);
  if (!patient || !doctor) {
    return null;
  }
  const review = new ReviewModel({ ...reviewObj, patient: patient });
  await review.save();
  doctor.reviews.push(review);
  await doctor.save();
  return review;
};

export const findDoctorReviewsById = async (
  doctorId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const doctor = await DoctorModel.findById(doctorId).populate('reviews');
  if (!doctor) {
    return null;
  }
  const count = doctor.reviews.length;
  const totalPages = Math.ceil(count / limit);
  const skip = (page - 1) * limit;
  return {
    reviews: doctor.reviews.slice(skip, skip + limit),
    totalPages,
    currentPage: page,
  };
};
