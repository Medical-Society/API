import { Request, Response, NextFunction } from 'express';
import Doctor from '../models/doctor';

export const checkDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const doctor = await Doctor.findById(req.body.auth._id);
    if (!doctor) {
      return res
        .status(404)
        .json({ status: 'fail', message: 'Please login as a doctor first' });
    }
    if (doctor.status !== 'ACCEPTED') {
      return res
        .status(403)
        .json({ status: 'fail', message: 'You are not authorized' });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      error: err,
      message: 'Error in checking doctor',
    });
  }
};
