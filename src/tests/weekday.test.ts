import { WeekDay } from '../models/enums';
import { getDateNextWeekDayHour } from '../utils/weekday';

console.log(getDateNextWeekDayHour(WeekDay.MONDAY, 20));
