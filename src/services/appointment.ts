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
import { createChats } from './chat';

export const isDoctorAvailable = async (
  doctor: string,
  date: Date,
  available: AvailableTime,
) => {
  if (date < new Date()) {
    return false;
  }
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
  autoCancelLateAppointments();
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', []);
  }
  const canBook = await isDoctorAvailable(doctorId, date, doctor.availableTime);
  if (!canBook) {
    throw new HttpException(400, 'Doctor is not available at this time', []);
  }
  const alreadyBooked = await AppointmentModel.findOne({
    doctor: doctorId,
    patient: patientId,
    status: AppointmentStatus.PENDING,
  });
  if (alreadyBooked) {
    throw new HttpException(
      400,
      'You already have an appointment with this doctor',
      [],
    );
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
  await autoCancelLateAppointments();
  const {
    page = 1,
    limit = 100,
    startDate,
    endDate = new Date(),
    ...filter
  } = query;
  const count = await AppointmentModel.countDocuments(filter);
  const totalPages = Math.ceil(count / limit);
  const currentPage = Math.min(totalPages, page);
  const skip = Math.max(0, (currentPage - 1) * limit);

  let appointmentQuery = AppointmentModel.find(filter)
    .populate('patient', '-password')
    .populate('doctor', '-password');

  if (startDate && endDate) {
    appointmentQuery = appointmentQuery
      .where('date')
      .gte(startDate.getTime())
      .lte(endDate.getTime());
  }

  let appointments = await appointmentQuery.exec();

  appointments.sort((a, b) => {
    const sortOrder = Object.keys(AppointmentStatus);
    const diff = sortOrder.indexOf(a.status) - sortOrder.indexOf(b.status);
    return diff || b.date.getTime() - a.date.getTime();
  });

  appointments = appointments.slice(skip, skip + limit);

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
  await autoCancelLateAppointments();
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
  await autoCancelLateAppointments();
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
  await autoCancelLateAppointments();
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
  if (newAppointment.status) {
    if (
      !(
        (newAppointment.status === AppointmentStatus.FINISHED &&
          appointment.status === AppointmentStatus.IN_PROGRESS) ||
        (newAppointment.status === AppointmentStatus.IN_PROGRESS &&
          appointment.status === AppointmentStatus.PENDING)
      )
    ) {
      throw new HttpException(400, 'Invalid change status', []);
    }
  }
  if (newAppointment.status === AppointmentStatus.IN_PROGRESS) {
    const inProgressAppointment = await AppointmentModel.findOne({
      doctor: doctorId,
      status: AppointmentStatus.IN_PROGRESS,
    });
    if (inProgressAppointment) {
      throw new HttpException(400, 'Doctor is busy with another patient');
    }
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
  const result = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    newAppointment,
    { new: true },
  );

  createChats(result);
};

export const isPatientWithDoctorNow = async (
  patientId: string,
  doctorId: string,
) => {
  await autoCancelLateAppointments();
  const result = await AppointmentModel.findOne({
    patient: patientId,
    doctor: doctorId,
    status: AppointmentStatus.IN_PROGRESS,
  });
  return result && result.status === AppointmentStatus.IN_PROGRESS;
};

export const getAppointmentsBeforeYou = async (appointmentId: string) => {
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) {
    throw new HttpException(404, 'Appointment not found', []);
  }
  if (appointment.status !== AppointmentStatus.PENDING) {
    throw new HttpException(400, 'Appointment is not pending', []);
  }
  const equalAppointments = await AppointmentModel.find({
    doctor: appointment.doctor,
    date: appointment.date,
    status: AppointmentStatus.PENDING,
  }).sort({ createdAt: 1 });
  const lessThanAppointments = await AppointmentModel.find({
    doctor: appointment.doctor,
    date: { $lt: appointment.date },
    status: AppointmentStatus.PENDING,
  });

  const index = equalAppointments.findIndex(
    (equalAppointment) =>
      equalAppointment._id.toString() === appointment._id.toString(),
  );
  console.log('equalAppointments.indexOf(appointment)', index);

  return lessThanAppointments.length + index;
};
