import HttpException from '../models/errors';

export const weekdays = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const getDateNextWeekDayHour = (weekday: string, hour: number) => {
  let numberOfWeekDay = weekdays.indexOf(weekday);
  if (numberOfWeekDay === -1) {
    throw new HttpException(500, 'Invalid weekday', []);
  }
  const today = new Date();
  let nextWeekday =
    today.getDate() + ((numberOfWeekDay - today.getDay() + 7) % 7);
  if (nextWeekday === today.getDate() && today.getHours() >= hour) {
    nextWeekday += 7;
  }
  const dateNextWeekDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    nextWeekday,
    hour,
  );
  return dateNextWeekDay;
};
