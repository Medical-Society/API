import HttpException from '../models/errors';
import AppointmentModel from '../models/appointment';
import DoctorModel from '../models/doctor';
import {
  ISearchAppointmentQuery,
  IUpdateAppointmentInput,
} from '../schema/appointment';
import { AvailableTime } from '../models/availableTime';
import { weekdays } from '../utils/weekday';
import { AppointmentStatus, WeekDay } from '../models/enums';

export const isDoctorAvailable = async (
  doctor: string,
  date: Date,
  available: AvailableTime,
) => {
  const availableDay = available.weekdays[weekdays[date.getDay()] as WeekDay];
  console.log('availDay', availableDay);
  if (
    availableDay &&
    availableDay.from.hour <= date.getHours() &&
    date.getHours() <= availableDay.to.hour
  ) {
    const appointments = await AppointmentModel.find({
      doctor,
      date,
      status: AppointmentStatus.PENDING,
    });
    return available.limit > appointments.length;
  }
  return false;
};

export const bookAppointment = async (
  patientId: string,
  doctorId: string,
  date: Date,
) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', []);
  }
  const canBook = await isDoctorAvailable(doctorId, date, doctor.availableTime);
  if (!canBook) {
    throw new HttpException(400, 'Doctor is not available at this time', []);
  }
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const appointment = new AppointmentModel({
    patient: patientId,
    doctor: doctorId,
    date: date,
  });
  await appointment.save();
  return appointment;
};

const autoCancelLateAppointments = async () => {
  const now = new Date();
  now.setHours(now.getHours() - 1);
  const appointments = await AppointmentModel.find({
    date: { $lte: now },
    status: AppointmentStatus.PENDING,
  });
  appointments.forEach(async (appointment) => {
    appointment.status = AppointmentStatus.CANCELED;
    await appointment.save();
  });
};

export const searchAppointment = async (query: ISearchAppointmentQuery) => {
  autoCancelLateAppointments();
  const { page = 1, limit = 10 } = query;
  const filter = { ...query };
  const count = await AppointmentModel.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
  console.log('filter', filter, skip, limit, totalPages, currentPage);
  const appointments = await AppointmentModel.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ date: -1 })
    .exec();
  return {
    length: appointments.length,
    appointments,
    totalPages,
    currentPage,
  };
};

export const findAppointment = async (
  patientId: string,
  appointmentId: string,
) => {
  autoCancelLateAppointments();
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new HttpException(404, 'Appointment not found', []);
  }
  if (!appointment?.patient._id.equals(patientId)) {
    throw new HttpException(
      403,
      'You are not allowed to get this appointment',
      ['You are not allowed to get this appointment'],
    );
  }
  return appointment;
};
export const cancelPendingAppointment = async (
  patientId: string,
  appointmentId: string,
) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new HttpException(404, 'Appointment not found', []);
  }
  if (
    !appointment?.patient._id.equals(patientId) ||
    appointment.status !== AppointmentStatus.PENDING
  ) {
    throw new HttpException(
      403,
      'You are not allowed to cancel this appointment',
      [],
    );
  }
  appointment.status = AppointmentStatus.CANCELED;
  await appointment.save();
};

export const updateAppointmentById = async (
  doctorId: string,
  newAppointment: IUpdateAppointmentInput,
  appointmentId: string,
) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new HttpException(404, 'Appointment not found', []);
  }
  if (!appointment.doctor._id.equals(doctorId)) {
    throw new HttpException(
      403,
      'You are not allowed to edit this appointment',
      [],
    );
  }
  if (newAppointment.date) {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      throw new HttpException(404, 'Doctor not found', []);
    }
    const isAvailable = await isDoctorAvailable(
      doctorId,
      newAppointment.date,
      doctor.availableTime,
    );
    if (!isAvailable) {
      throw new HttpException(400, 'Doctor is not available at this time', []);
    }
  }
  await AppointmentModel.findByIdAndUpdate(appointmentId, newAppointment);
};
