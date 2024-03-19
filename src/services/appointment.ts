import HttpException from '../models/errors';
import AppointmentModel, { Appointment } from '../models/appointment';
import DoctorModel from '../models/doctor';
import { FilterQuery, ObjectId, Types } from 'mongoose';
import { SearchAppointmentQueryInput } from '../schema/appointment';
import { AvailableTime } from '../models/availableTime';
import { weekdays } from '../utils/weekday';
import { WeekDay } from '../models/enums';
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

export const searchAppointment = async (
  query: SearchAppointmentQueryInput,
  patientId?: string,
) => {
  const { status, page = 1, limit = 10, price, doctor, paid } = query;
  const filter = {
    status,
    doctor,
    paid,
    price,
    patient: patientId,
  };
  const count = await AppointmentModel.countDocuments();
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);
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
export const findAppointmentAndDelete = async (
  patientId: string,
  appointmentId: string,
) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new HttpException(404, 'Appointment not found', []);
  }
  if (!appointment?.patient._id.equals(patientId)) {
    throw new HttpException(
      403,
      'You are not allowed to delete this appointment',
      [],
    );
  }
  await AppointmentModel.findByIdAndDelete(appointmentId);
};

export const changeAppointmentStatus = async (
  doctorId: string,
  status: any,
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
  appointment.status = status;
  await appointment.save();
  return appointment;
};
