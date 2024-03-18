import { AvailableTime } from '../models/availableTime';
import { Gender, Status, WeekDay } from '../models/enums';
import { expect, describe, it } from 'vitest';

describe('Gender enums', () => {
  it('should have valid values', () => {
    expect(Gender.MALE).toBe('MALE');
    expect(Gender.FEMALE).toBe('FEMALE');
  });
});

const avt = new AvailableTime();
