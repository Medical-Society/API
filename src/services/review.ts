import DoctorModel from '../models/doctor';
import HttpException from '../models/errors';
import PatientModel from '../models/patient';
import ReviewModel from '../models/review';
import { GetAllReviewsQueryInput } from '../schema/review';

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
  const existingReview = await ReviewModel.findOne({
    patient: patientId,
    doctor: doctorId,
  });
  if (existingReview) {
    throw new HttpException(400, 'You already reviewed this doctor');
  }

  const review = new ReviewModel({ ...reviewObj, patient, doctor });
  await review.save();
};

export const findDoctorReviewsById = async (
  doctorId: string,
  query: GetAllReviewsQueryInput,
) => {
  let { page = 1, limit = 20 } = query;
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', ['doctor not found']);
  }
  const reviews = await ReviewModel.find({ doctor: doctorId }).populate(
    'patient',
    '-password',
  );
  const count = reviews.length;
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const result = reviews.slice(skip, skip + limit);
  if (query.patientId) {
    const patientReview = result.find((review) =>
      review.patient._id.equals(query.patientId),
    );
    if (patientReview) {
      result.splice(result.indexOf(patientReview), 1);
      result.unshift(patientReview);
    }
  }
  return {
    length: result.length,
    reviews: result,
    totalPages,
    currentPage,
  };
};

export const findReviewById = async (doctorId: string, reviewId: string) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', ['doctor not found']);
  }
  const review = await ReviewModel.findById(reviewId).populate(
    'patient',
    '-password',
  );
  if (!review || !review.doctor._id.equals(doctorId)) {
    throw new HttpException(404, 'Review not found', ['review not found']);
  }
  return review;
};

export const deleteReviewById = async (reviewId: string, patientId: string) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    throw new HttpException(404, 'Review not found', ['review not found']);
  }
  if (!review.patient._id.equals(patientId)) {
    throw new HttpException(403, 'You are not allowed to delete this review', [
      'You are not allowed to delete this review',
    ]);
  }
  return await ReviewModel.findByIdAndDelete(reviewId);
};

export const updateReviewById = async (
  reviewId: string,
  patientId: string,
  updateBody: { rating?: number; comment?: string },
) => {
  const review = await ReviewModel.findById(reviewId);
  if (!review) {
    throw new HttpException(404, 'Review not found', ['review not found']);
  }
  if (!review.patient._id.equals(patientId)) {
    throw new HttpException(403, 'You are not allowed to update this review', [
      'You are not allowed to update this review',
    ]);
  }
  if (updateBody.rating) {
    review.rating = updateBody.rating;
  }
  if (updateBody.comment) {
    review.comment = updateBody.comment;
  }
  return await review.save();
};
