import HttpException from '../models/errors';
import AppointmentModel from '../models/appointment';
export const bookAppointment = async (
  patientId: string,
  doctorId: string,
  date: Date,
) => {
  const appointment = new AppointmentModel({
    patient: patientId,
    doctor: doctorId,
    date: date,
  });
  await appointment.save();
  return appointment;
};
