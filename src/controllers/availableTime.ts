import { Request, Response, NextFunction } from 'express';
import {
  GetAvailableTimesBodyInput,
  UpdateAvailableTimeBodyInput,
} from '../schema/availableTime';
import {
  editAvailableTime,
  findAvailableTimes,
} from '../services/availableTime';
import { AvailableTime } from '../models/availableTime';

export const getAvailableTimes = async (
  req: Request<{}, {}, GetAvailableTimesBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findAvailableTimes(req.body.doctorId);
    res.status(200).json({ status: 'success', data });
  } catch (err: any) {
    next(err);
  }
};

export const updateAvailableTime = async (
  req: Request<{}, {}, UpdateAvailableTimeBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await editAvailableTime(
      req.body.auth.doctorId,
      req.body.availableTime as AvailableTime,
    );
    res.status(200).json({
      status: 'success',
      data: { message: 'Available time is updated successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};
