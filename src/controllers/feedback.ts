import { NextFunction, Request, Response } from 'express';
import { createFeedback, readAllFeedbacks } from '../services/feedback';
import { AddFeedbackBodyInput } from '../schema/feedback';

export const addFeedback = async (
  req: Request<{}, {}, AddFeedbackBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await createFeedback(req.body);
    res.status(201).json({ message: 'Feedback added successfully' });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedbacks = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const feedbacks = await readAllFeedbacks();
    res.status(200).json({
      status: 'success',
      data: { feedbacks },
    });
  } catch (error) {
    next(error);
  }
};
