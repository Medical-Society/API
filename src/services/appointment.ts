import HttpException from '../models/errors';
import AppointmentModel from '../models/appointment';
import DoctorModel from '../models/doctor';

export const isDoctorAvailable = async (
  doctor: string,
  date: Date,
  limit: number,
) => {
  const appointments = await AppointmentModel.find({
    doctor,
    date,
  });
  return limit > appointments.length;
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
  const canBook = await isDoctorAvailable(
    doctorId,
    date,
    doctor.availableTime.limit,
  );
  if (!canBook) {
    throw new HttpException(400, 'Doctor is not available at this time', []);
  }
  const appointment = new AppointmentModel({
    patient: patientId,
    doctor: doctorId,
    date: date,
  });
  await appointment.save();
  return appointment;
};
