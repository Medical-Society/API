import HttpException from '../models/errors';
import AppointmentModel, { Appointment } from '../models/appointment';
import DoctorModel from '../models/doctor';
import { FilterQuery, Types } from 'mongoose';
import { SearchAppointmentQueryInput } from '../schema/appointment';
import { AvailableTime } from '../models/availableTime';
import { weekdays } from '../utils/weekday';
import { WeekDay } from '../models/enums';
export const isDoctorAvailable = async (
  doctor: string,
  date: string,
  available: AvailableTime,
) => {
  const d = new Date(date);
  console.log(d instanceof Date);
  if (!available.weekdays) {
    throw new HttpException(500, 'week days', []);
  }
  const availableDay = available.weekdays[weekdays[d.getDay()] as WeekDay];
  console.log('availDay', availableDay);
  if (
    availableDay &&
    availableDay.from.hour <= d.getHours() &&
    d.getHours() <= availableDay.to.hour
  ) {
    const appointments = await AppointmentModel.find({
      doctor,
      d,
    });
    return available.limit > appointments.length;
  }
  return false;
};

export const bookAppointment = async (
  patientId: string,
  doctorId: string,
  d: string,
) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', []);
  }
  const date = new Date(d);
  const canBook = await isDoctorAvailable(doctorId, d, doctor.availableTime);
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
  filter: FilterQuery<Appointment>,
  patientId: string,
  query: SearchAppointmentQueryInput,
) => {
  let { status, page = 1, limit = 20, price, doctor, paid } = query;
  filter['patient'] = patientId;
  if (status) {
    filter['status'] = { $regex: new RegExp(status, 'i') };
  }
  if (price) {
    filter['price'] = price;
  }
  if (doctor) {
    filter['doctor'] = doctor;
  }
  if (paid) {
    filter['paid'] = paid;
  }
  const count = await AppointmentModel.countDocuments(filter);
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
