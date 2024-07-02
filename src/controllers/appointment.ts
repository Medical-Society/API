import { NextFunction, Request, Response } from 'express';
import {
  BookAppointmentBodyInput,
  UpdateAppointmentBodyInput,
  UpdateAppointmentParamsInput,
  GetAppointmentBodyInput,
  GetAppointmentParamsInput,
  SearchDoctorAppointmentBodyInput,
  SearchDoctorAppointmentQueryInput,
  SearchPatientAppointmentBodyInput,
  SearchPatientAppointmentQueryInput,
  IUpdateAppointmentInput,
  GetAppointmentsBeforeYouParams,
} from '../schema/appointment';
import {
  bookAppointment,
  updateAppointmentById,
  findAppointment,
  cancelPendingAppointment,
  searchAppointment,
  getAppointmentsBeforeYou,
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
  req: Request<
    {},
    {},
    SearchPatientAppointmentBodyInput,
    SearchPatientAppointmentQueryInput
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Search patient appointment');
    const data = await searchAppointment({
      patient: req.body.auth.patientId,
      ...req.query,
    });
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (err: any) {
    console.log(err);
    next(err);
  }
};

export const searchDoctorAppointment = async (
  req: Request<
    {},
    {},
    SearchDoctorAppointmentBodyInput,
    SearchDoctorAppointmentQueryInput
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log('Search doctor appointment');
    const data = await searchAppointment({
      doctor: req.body.auth.doctorId,
      ...req.query,
    });
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

export const cancelPatientAppointment = async (
  req: Request<GetAppointmentParamsInput, {}, GetAppointmentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await cancelPendingAppointment(
      req.body.auth.patientId,
      req.params.appointmentId,
    );
    return res.status(204).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateDoctorAppointment = async (
  req: Request<UpdateAppointmentParamsInput, {}, UpdateAppointmentBodyInput>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = req.body as IUpdateAppointmentInput;
    await updateAppointmentById(
      req.body.auth.doctorId,
      payload,
      req.params.appointmentId,
    );
    return res.status(200).json({
      status: 'success',
      data: { message: 'Appointment updated successfully' },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAppointmentsBeforeYouPatient = async (
  req: Request<GetAppointmentsBeforeYouParams>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appointmentsBeforeYou = await getAppointmentsBeforeYou(req.params.appointmentId);
    return res.status(200).json({
      status: 'success',
      data : appointmentsBeforeYou,
    })
  } catch (err: any) {
    next(err);
  }
};
