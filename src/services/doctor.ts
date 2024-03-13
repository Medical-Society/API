import { FilterQuery, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';
import PostModel from '../models/post';
import HttpException from '../models/errors';
import { SearchDoctorInput } from '../schema/doctor';
import CommentModel from '../models/comment';

export const findDoctorByEmail = async (email: string) => {
  return await DoctorModel.findOne({ email });
};

export const createDoctor = (doctor: any) => {
  return DoctorModel.create(doctor);
};

export const findDoctorById = (
  doctorId: string,
  projection?: ProjectionType<Doctor>,
) => {
  return DoctorModel.findById(doctorId, projection);
};

export const findDoctorByIdAndUpdate = (
  doctorId: string,
  update: any,
  options: any = { new: true },
) => {
  return DoctorModel.findByIdAndUpdate(doctorId, update, options);
};

export const findDoctorByIdAndDelete = async (doctorId: string) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(400, 'Doctor not Found', ['doctor does not exist']);
  }
  const posts = await PostModel.find({ doctorId });

  for (const post of posts) {
    await CommentModel.deleteMany({ postId: post._id });
  }
  await PostModel.deleteMany({ doctorId });
  await DoctorModel.findByIdAndDelete(doctorId);
};

export const findDoctor = async (
  filter: FilterQuery<Doctor>,
  query: SearchDoctorInput,
) => {
  let {
    searchTerm,
    specialization,
    englishFullName,
    clinicAddress,
    page = 1,
    limit = 20,
  } = query;
  if (searchTerm) {
    filter['$or'] = [
      { englishFullName: { $regex: new RegExp(searchTerm, 'i') } },
      { specialization: { $regex: new RegExp(searchTerm, 'i') } },
      { clinicAddress: { $regex: new RegExp(searchTerm, 'i') } },
    ];
  }

  if (englishFullName) {
    filter['englishFullName'] = { $regex: new RegExp(englishFullName, 'i') };
  }

  if (specialization) {
    filter['specialization'] = { $regex: new RegExp(specialization, 'i') };
  }

  if (clinicAddress) {
    filter['clinicAddress'] = { $regex: new RegExp(clinicAddress, 'i') };
  }

  const count = await DoctorModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const doctors = await DoctorModel.find(filter).skip(skip).limit(limit).exec();
  return {
    length: doctors.length,
    doctors,
    totalPages,
    currentPage,
  };
};
