import { FilterQuery, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';
import PostModel from '../models/post';
import HttpException from '../models/errors';
import { SearchDoctorInputQuery } from '../schema/doctor';
import CommentModel from '../models/comment';
import { addAverageReviewForDoctor } from './review';
import LikeModel from '../models/like';
import AppointmentModel from '../models/appointment';
import FeedbackModel from '../models/feedback';

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

  const posts = await PostModel.find({ doctor: doctorId});
  for (const post of posts) {
    CommentModel.deleteMany({ post: post._id });
    LikeModel.deleteMany({ post: post._id });
  }
  AppointmentModel.deleteMany({ doctor: doctorId });
  FeedbackModel.deleteMany({ doctor: doctorId });
  PostModel.deleteMany({ doctor: doctorId });

  await DoctorModel.findByIdAndDelete({ doctor: doctorId });
};

export const findDoctors = async (
  filter: FilterQuery<Doctor>,
  query: SearchDoctorInputQuery,
  isAdmin: boolean,
) => {
  addAverageReviewForDoctor();

  let { searchTerm, page = 1, limit = 20 } = query;
  if (!isAdmin) filter.status = 'ACCEPTED';

  filter.isVerified = true;

  if (searchTerm) {
    filter['$or'] = [
      { englishFullName: { $regex: new RegExp(searchTerm, 'i') } },
      { specialization: { $regex: new RegExp(searchTerm, 'i') } },
      { clinicAddress: { $regex: new RegExp(searchTerm, 'i') } },
    ];
    if (isAdmin)
      filter['$or'].push({ status: { $regex: new RegExp(searchTerm, 'i') } });
  }
  const count = await DoctorModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const doctors = await DoctorModel.find(filter)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ averageReview: -1 })
    .exec();

  return {
    length: doctors.length,
    doctors,
    totalPages,
    currentPage,
  };
};
