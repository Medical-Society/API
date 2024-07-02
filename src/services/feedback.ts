import HttpException from '../models/errors';
import FeedbackModel from '../models/feedback';
import {
  AddFeedbackBodyInput,
  GetFeedbackQueryInput,
} from '../schema/feedback';

export const createFeedback = async (body: AddFeedbackBodyInput) => {
  const found = await FeedbackModel.findOne({ doctor: body.auth.doctorId });
  if (found) {
    throw new HttpException(400, 'You already added feedback');
  }
  const feedback = new FeedbackModel({
    doctor: body.auth.doctorId,
    rating: body.rating,
    comment: body.comment,
  });
  await FeedbackModel.create(feedback);
};

export const readAllFeedbacks = async (query: GetFeedbackQueryInput) => {
  let { limit = 20, page = 1 } = query;
  const count = await FeedbackModel.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  const feedbacks = await FeedbackModel.find()
    .skip(skip)
    .limit(limit)
    .populate('doctor', '-password')
    .sort({ rating: -1 })
    .exec();

  return {
    length: feedbacks.length,
    feedbacks,
    totalPages,
    currentPage,
  };
};
