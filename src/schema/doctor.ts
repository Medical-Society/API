import { z } from 'zod';
import { Gender, Status } from '../models/enums';
import { zodObjectId, validAgeDate, paginationQuery } from './customZod';

// Schemas
export const saveDoctorAvatarSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      imageURL: z.string({ required_error: 'Image is required' }),
    })
    .strict(),
});

export const signupDoctorSchema = z.object({
  body: z
    .object({
      englishFullName: z.string({
        required_error: 'English Full Name is required',
      }),
      arabicFullName: z.string({
        required_error: 'Arabic Full Name is required',
      }),
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email')
        .transform((value) => value.toLowerCase()),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters long'),
      specialization: z
        .string({ required_error: 'Specialization is required' })
        .min(3),
      clinicAddress: z.string().optional(),
      nationalID: z
        .string({ required_error: 'National ID is required' })
        .length(14, 'Invalid National ID, must be 14 digits'),
      phoneNumber: z
        .string({ required_error: 'Phone Number is required' })
        .regex(/^01[0|1|2|5][0-9]{8}$/, 'Invalid Phone Number'),
      birthdate: validAgeDate(18),
      gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    })
    .strict(),
});

export const loginDoctorSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email')
        .transform((value) => value.toLowerCase()),
      password: z.string({ required_error: 'Password is required' }),
    })
    .strict(),
});

export const verifyDoctorSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      images: z.array(z.string()),
      location: z.array(z.coerce.number()),
    })
    .strict(),
});

export const getDoctorSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
});

export const forgotPasswordDoctorSchema = z.object({
  body: z
    .object({
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email')
        .transform((value) => value.toLowerCase()),
    })
    .strict(),
});

export const resetPasswordDoctorSchema = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Token is required' }),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters long'),
    })
    .strict(),
});

export const updateDoctorSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      specialization: z.string().optional(),
      clinicAddress: z.string().optional(),
      phoneNumber: z
        .string()
        .regex(/^01[0|1|2|5][0-9]{8}$/, 'Invalid phone number')
        .optional(),
      about: z.string().optional(),
    })
    .strict(),
});

export const deleteMyAccountSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
    })
    .strict(),
});

export const updateDoctorPasswordSchema = z.object({
  body: z
    .object({
      auth: z.object({
        doctorId: zodObjectId,
      }),
      oldPassword: z.string({ required_error: 'Old Password is required' }),
      newPassword: z
        .string({ required_error: 'New Password is required' })
        .min(8, 'Password must be at least 8 characters long'),
    })
    .strict(),
});

export const changeDoctorStatusSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
  body: z
    .object({
      auth: z.object({
        adminId: zodObjectId,
      }),
      status: z.nativeEnum(Status, {
        required_error: 'Status is required',
      }),
    })
    .strict(),
});

export const deleteDoctorSchema = z.object({
  params: z
    .object({
      doctorId: zodObjectId,
    })
    .strict(),
});

export const searchDoctorSchema = z.object({
  body: z.object({
    auth: z.object({
      id: zodObjectId,
    }),
  }),
  query: z
    .object({
      searchTerm: z.string().optional(),
      location: z.array(z.coerce.number()).optional(),
      maxDistanceMeter: z.coerce.number().optional(),
    })
    .merge(paginationQuery)
    .strict(),
});

// Types

export type SaveDoctorAvatarBody = z.infer<
  typeof saveDoctorAvatarSchema
>['body'];

export type SignupDoctorInput = z.infer<typeof signupDoctorSchema>['body'];

export type LoginDoctorInput = z.infer<typeof loginDoctorSchema>['body'];

export type VerifyDoctorInput = z.infer<typeof verifyDoctorSchema>['body'];

export type GetDoctorInput = z.infer<typeof getDoctorSchema>['params'];

export type ForgotPasswordDoctorInput = z.infer<
  typeof forgotPasswordDoctorSchema
>['body'];

export type ResetPasswordDoctorInput = z.infer<
  typeof resetPasswordDoctorSchema
>['body'];

export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>['body'];

export type DeleteMyDoctorInput = z.infer<typeof deleteMyAccountSchema>['body'];

export type UpdateDoctorPasswordInput = z.infer<
  typeof updateDoctorPasswordSchema
>['body'];

export type ChangeDoctorStatusInput = z.infer<typeof changeDoctorStatusSchema>;

export type DeleteDoctorInput = z.infer<typeof deleteDoctorSchema>['params'];

export type SearchDoctorInputQuery = z.output<
  typeof searchDoctorSchema
>['query'];
export type SearchDoctorInputBody = z.output<typeof searchDoctorSchema>['body'];
