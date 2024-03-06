import { FilterQuery, ProjectionType } from 'mongoose';
import DoctorModel, { Doctor } from '../models/doctor';
import ReviewModel from '../models/review';
import PatientModel from '../models/patient';
import PostModel from '../models/post';
import HttpException from '../models/errors';
import { SearchDoctorInput } from '../schema/doctor';

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
  query: SearchDoctorInput,
) => {
  const {
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
  const pageS = Math.min(totalPages, page);
  const skip = (pageS - 1) * limit;
  const doctors = await DoctorModel.find(filter).skip(skip).limit(limit).exec();
  return {
    length: doctors.length,
    doctors,
    totalPages,
    currentPage: pageS,
  };
};

export const CreatePost = async (
  id: string,
  description: string,
  images: string[] | undefined,
) => {
  const post = new PostModel();
  post.doctorId = id;
  post.description = description;
  if (images != undefined) {
    post.images = images;
  }

  await post.save();

  return post;
};

export const addReviewForDoctorById = async (
  doctorId: string,
  patientId: string,
  reviewObj: any,
) => {
  const patient = await PatientModel.findById(patientId);
  const doctor = await DoctorModel.findById(doctorId);
  if (!patient) {
    throw new HttpException(404, 'Patient not found');
  }
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found');
  }

  const review = new ReviewModel({ ...reviewObj, patient: patient });
  await review.save();
  doctor.reviews.push(review);
  await doctor.save();
};

export const findDoctorReviewsById = async (
  doctorId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const doctor = await DoctorModel.findById(doctorId)
    .populate('reviews')
    .select('-password');
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found');
  }
  const count = doctor.reviews.length;
  const totalPages = Math.ceil(count / limit);
  const pageS = Math.min(totalPages, page);
  const skip = (pageS - 1) * limit;
  const reviews = doctor.reviews.slice(skip, skip + limit);
  return {
    length: reviews.length,
    reviews,
    totalPages,
    currentPage: pageS,
  };
};
export const findPosts = async (
  id: string,
  page: number = 1,
  limit: number = 20,
) => {
  const result = await PostModel.find({ doctorId: id }).select('-doctorId');
  const count = result.length;
  const totalPages = Math.ceil(count / limit);
  const pageS = Math.min(totalPages, page);
  const skip = (pageS - 1) * limit;
  const posts = result.slice(skip, skip + limit);
  return {
    length: result.length,
    posts,
    totalPages,
    currentPage: pageS,
  };
};

export const findPostByIdAndDelete = async (postId: string) => {
  return await PostModel.findByIdAndDelete(postId);
};
