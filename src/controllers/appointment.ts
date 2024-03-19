import { NextFunction, Request, Response } from 'express';
import {
  BookAppointmentBodyInput,
  GetAppointmentBodyInput,
  GetAppointmentParamsInput,
  SearchAppointmentBodyInput,
  SearchAppointmentQueryInput,
} from '../schema/appointment';
import {
  bookAppointment,
  findAppointment,
  searchAppointment,
} from '../services/appointment';

export const bookPatientAppointment = async (
  req: Request<{}, {}, BookAppointmentBodyInput>,
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
    console.log(err);
    next(err);
  }
};

export const searchPatientAppointment = async (
  req: Request<{}, {}, SearchAppointmentBodyInput, SearchAppointmentQueryInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await searchAppointment(
      {},
      req.body.auth.patientId,
      req.query,
    );
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const getPatientAppointment = async (
  req: Request<GetAppointmentParamsInput, {}, GetAppointmentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await findAppointment(
      req.body.auth.patientId,
      req.params.appointmentId,
    );
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    next(err);
  }
};
