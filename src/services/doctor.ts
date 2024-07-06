import { FilterQuery, PipelineStage, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';
import PostModel from '../models/post';
import HttpException from '../models/errors';
import { SearchDoctorInputQuery } from '../schema/doctor';
import CommentModel from '../models/comment';
import { addAverageReviewForDoctor } from './review';
import LikeModel from '../models/like';
import AppointmentModel from '../models/appointment';
import FeedbackModel from '../models/feedback';
import ReviewModel from '../models/review';

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
  const posts = await PostModel.find({ doctor: doctorId });
  for (const post of posts) {
    await CommentModel.deleteMany({ post: post._id });
    await LikeModel.deleteMany({ post: post._id });
  }
  await AppointmentModel.deleteMany({ doctor: doctorId });
  await FeedbackModel.deleteMany({ doctor: doctorId });
  await PostModel.deleteMany({ doctor: doctorId });
  await ReviewModel.deleteMany({ doctor: doctorId });

  await DoctorModel.findByIdAndDelete(doctorId);
};

export const findDoctors = async (
  filter: FilterQuery<Doctor>,
  query: SearchDoctorInputQuery,
  isAdmin: boolean,
) => {
  addAverageReviewForDoctor();

  let {
    searchTerm,
    page = 1,
    limit = 20,
    location,
    maxDistanceMeter = 400000,
  } = query;
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
  const pipeline: PipelineStage[] = [];
  if (location) {
    console.log('location', location);
    pipeline.push({
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [location[0], location[1]],
        },
        distanceField: 'distance',
        spherical: true,
        maxDistance: maxDistanceMeter,
      },
    });
  }
  pipeline.push({
    $match: filter,
  });
  pipeline.push({
    $sort: {
      averageReview: -1,
    },
  });
  pipeline.push({
    $project: {
      password: 0,
    },
  });

  const doctors = await DoctorModel.aggregate(pipeline);

  const length = doctors.length;
  const totalPages = Math.ceil(length / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const results = doctors.slice(skip, skip + limit);

  return {
    length,
    doctors: results,
    totalPages,
    currentPage,
  };
};
