import { describe, it, expect } from 'vitest';
import { loginDoctorSchema } from '../schema/doctor';

describe('Login Schema', () => {
  it('should validate a valid login object', () => {
    const validLogin = {
      body: {
        email: 'john_doe@fdsa.com',
        password: 'password123',
      },
    };

    const result = loginDoctorSchema.safeParse(validLogin);

    expect(result.success).toBe(true);
  });

  it('should not validate an invalid login object', () => {
    const invalidLogin = {
      username: 'john_doe',
    };

    const result = loginDoctorSchema.safeParse(invalidLogin);

    expect(result.success).toBe(false);
  });
});
