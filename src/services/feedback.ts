import HttpException from '../models/errors';
import FeedbackModel from '../models/feedback';
import { AddFeedbackBodyInput } from '../schema/feedback';

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

export const readAllFeedbacks = async () => {
  return await FeedbackModel.find()
    .populate('doctor', '-password')
    .sort({ rating: -1 });
};
