import { NextFunction, Request, Response } from 'express';
import { bookAppointmentBodyInput } from '../schema/appointment';
import { bookAppointment } from '../services/appointment';

export const bookPatientAppointment = async (
  req: Request<{}, {}, bookAppointmentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointment = await bookAppointment(
      req.body.auth.patientId,
      req.body.doctorId,
      req.body.date,
    );
    return res.status(200).json({
      status: 'success',
      appointment,
    });
  } catch (err: any) {
    next(err);
  }
};
