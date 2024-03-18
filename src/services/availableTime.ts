import { AvailableTime } from '../models/availableTime';
import DoctorModel from '../models/doctor';
import { WeekDay } from '../models/enums';
import HttpException from '../models/errors';
import { getDateNextWeekDayHour } from '../utils/weekday';
import { isDoctorAvailable } from './appointment';

interface AvailableWeekDayTimeSlots {
  [key: string]: { dateNextWeekDay: Date; isAvailable: boolean };
}

export const findAvailableTimes = async (
  doctorId: string,
): Promise<AvailableWeekDayTimeSlots> => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', []);
  }

  const { weekdays: availableWeekDays, limit } = doctor.availableTime;
  const results: AvailableWeekDayTimeSlots = {};

  for (const weekday in availableWeekDays) {
    const { from, to } = availableWeekDays[weekday as WeekDay];
    for (let hour = from.hour; hour <= to.hour; hour++) {
      const dateNextWeekDay = getDateNextWeekDayHour(weekday, hour);
      const isAvailable = await isDoctorAvailable(
        doctorId,
        dateNextWeekDay,
        limit,
      );
      results[weekday] = { dateNextWeekDay, isAvailable };
    }
  }
  return results;
};

export const editAvailableTime = async (
  doctorId: string,
  availableTime: AvailableTime,
) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new HttpException(404, 'Doctor not found', []);
  }
  doctor.availableTime = availableTime;
  await doctor.save();
};
