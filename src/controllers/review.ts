import { Request, Response, NextFunction } from 'express';
import {
  AddReviewBodyInput,
  AddReviewParamsInput,
  DeleteReviewBodyInput,
  DeleteReviewParamsInput,
  GetAllReviewsParamsInput,
  GetAllReviewsQueryInput,
  GetReviewParamsInput,
  UpdateReviewBodyInput,
  UpdateReviewParamsInput,
} from '../schema/review';
import {
  addReviewForDoctorById,
  deleteReviewById,
  findDoctorReviewsById,
  findReviewById,
  updateReviewById,
} from '../services/review';

export const getAllReviews = async (
  req: Request<GetAllReviewsParamsInput, {}, {}, GetAllReviewsQueryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findDoctorReviewsById(req.params.doctorId, req.query);
    res.status(200).json({ status: 'success', data });
  } catch (err: any) {
    next(err);
  }
};

export const getReview = async (
  req: Request<GetReviewParamsInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const review = await findReviewById(
      req.params.doctorId,
      req.params.reviewId,
    );
    return res.status(200).json({
      status: 'success',
      data: review,
    });
  } catch (err: any) {
    next(err);
  }
};

export const addReview = async (
  req: Request<AddReviewParamsInput, {}, AddReviewBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await addReviewForDoctorById(
      req.params.doctorId,
      req.body.auth.patientId,
      req.body,
    );
    -res.status(201).json({
      status: 'success',
      data: { message: 'Review is created successfully' },
    });
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (
  req: Request<UpdateReviewParamsInput, {}, UpdateReviewBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await updateReviewById(
      req.params.reviewId,
      req.body.auth.patientId,
      req.body,
    );
    res.status(200).json({
      status: 'success',
      data: { message: 'Review updated successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteReview = async (
  req: Request<DeleteReviewParamsInput, {}, DeleteReviewBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await deleteReviewById(req.params.reviewId, req.body.auth.patientId);
    res.status(204).json({
      status: 'success',
      data: { message: 'Review deleted successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};
