import { describe, expect, it } from 'vitest';
import { WeekDay } from '../models/enums';
import { getDateNextWeekDayHour } from '../utils/weekday';

describe('getDateNextWeekDayHour', () => {
  it('should return the correct date for the next Monday at 20:00', () => {
    const result = getDateNextWeekDayHour(WeekDay.MONDAY, 20);
    const expectedDate = new Date();
    expectedDate.setDate(
      expectedDate.getDate() + ((1 + 7 - expectedDate.getDay()) % 7),
    );
    expectedDate.setHours(20, 0, 0, 0);
    expect(result).toEqual(expectedDate);
  });

  it('should return the correct date for the next Sunday at 12:00', () => {
    const result = getDateNextWeekDayHour(WeekDay.SUNDAY, 12);
    const expectedDate = new Date();
    expectedDate.setDate(
      expectedDate.getDate() + ((0 + 7 - expectedDate.getDay()) % 7),
    );
    expectedDate.setHours(12, 0, 0, 0);
    expect(result).toEqual(expectedDate);
  });
});
