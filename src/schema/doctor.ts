import { z } from 'zod';
import { Gender, Status } from '../models/enums';
import mongoose from 'mongoose';

const zodObjectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid Id');

// Schemas
export const signupDoctorSchema = z.object({
  body: z
    .object({
      englishFullName: z.string({
        required_error: 'English Full Name is required',
      }),
      arabicFullName: z.string({
        required_error: 'Arabic Full Name is required',
      }),
      email: z.string({ required_error: 'Email is required' }).email(),
      password: z.string({ required_error: 'Password is required' }).min(8),
      specialization: z
        .string({ required_error: 'Specialization is required' })
        .min(3),
      clinicAddress: z.string().optional(),
      nationalID: z
        .string({ required_error: 'National ID is required' })
        .length(14),
      phoneNumber: z
        .string({ required_error: 'Phone Number is required' })
        .regex(/^01[0|1|2|5][0-9]{8}$/),
      birthdate: z
        .string({ required_error: 'Birthdate is required' })
        .datetime({ message: 'Invalid datetime string! Must be ISO.' }),
      gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
    })
    .strict(),
});

export const loginDoctorSchema = z.object({
  body: z
    .object({
      email: z.string({ required_error: 'Email is required' }).email(),
      password: z.string({ required_error: 'Password is required' }),
    })
    .strict(),
});

export const verifyDoctorSchema = z.object({
  params: z
    .object({
      token: z.string({ required_error: 'Token is required' }),
    })
    .strict(),
});

export const getAllDoctorsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getDoctorSchema = z.object({
  params: z
    .object({
      id: zodObjectId,
    })
    .strict(),
});

export const forgotPasswordDoctorSchema = z.object({
  body: z
    .object({
      email: z.string({ required_error: 'Email is required' }).email(),
    })
    .strict(),
});

export const resetPasswordDoctorSchema = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Token is required' }),
      password: z.string({ required_error: 'Password is required' }).min(8),
    })
    .strict(),
});

export const updateDoctorSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      specialization: z.string().optional(),
      clinicAddress: z.string().optional(),
      phoneNumber: z
        .string()
        .regex(/^01[0|1|2|5][0-9]{8}$/)
        .optional(),
    })
    .strict(),
});

export const deleteMyAccountSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
    })
    .strict(),
});

export const updateDoctorPasswordSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      oldPassword: z.string({ required_error: 'Old Password is required' }),
      newPassword: z
        .string({ required_error: 'New Password is required' })
        .min(8),
    })
    .strict(),
});

export const changeDoctorStatusSchema = z.object({
  params: z
    .object({
      id: zodObjectId,
    })
    .strict(),
  body: z
    .object({
      status: z.nativeEnum(Status, {
        required_error: 'Status is required',
      }),
    })
    .strict(),
});

export const deleteDoctorSchema = z.object({
  params: z
    .object({
      id: zodObjectId,
    })
    .strict(),
});

export const searchDoctorSchema = z.object({
  query:z.object({
    englishFullName: z.string().optional(),
    specialization: z.string().optional(),
    clinicAddress: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),

  }).strict()
})

// Types
export type SignupDoctorInput = z.infer<typeof signupDoctorSchema>['body'];

export type LoginDoctorInput = z.infer<typeof loginDoctorSchema>['body'];

export type VerifyDoctorInput = z.infer<typeof verifyDoctorSchema>['params'];

export type GetAllDoctorsInput = z.infer<typeof getAllDoctorsSchema>['query'];

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

export type SearchDoctorInput = z.infer<typeof searchDoctorSchema>['query'];
