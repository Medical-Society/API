import { z } from 'zod';
import { Gender, Status } from '../models/doctor';
import mongoose from 'mongoose';

// Schemas
export const signupDoctorSchema = z.object({
  body: z.object({
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
      .regex(/^\d{11}$/),
    birthdate: z
      .string({ required_error: 'Birthdate is required' })
      .datetime({ message: 'Invalid datetime string! Must be ISO.' }),
    gender: z.nativeEnum(Gender, { required_error: 'Gender is required' }),
  }),
});

export const loginDoctorSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const verifyDoctorSchema = z.object({
  params: z.object({
    token: z.string({ required_error: 'Token is required' }),
  }),
});

export const getAllDoctorsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getDoctorSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
  }),
});

export const forgotPasswordDoctorSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
  }),
});

export const resetPasswordDoctorSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is required' }),
    password: z.string({ required_error: 'Password is required' }).min(8),
  }),
});

export const updateDoctorSchema = z.object({
  body: z.object({
    auth: z.object({
      _id: z
        .string()
        .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
    }),
    specialization: z.string().optional(),
    clinicAddress: z.string().optional(),
    phoneNumber: z
      .string()
      .regex(/^\d{11}$/)
      .optional(),
  }),
});

export const deleteMyAccountSchema = z.object({
  body: z.object({
    auth: z.object({
      _id: z
        .string()
        .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
    }),
  }),
});

export const updateDoctorPasswordSchema = z.object({
  body: z.object({
    auth: z.object({
      _id: z
        .string()
        .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
    }),
    oldPassword: z.string({ required_error: 'Old Password is required' }),
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .min(8),
  }),
});

export const changeDoctorStatusSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
  }),
  body: z.object({
    status: z.nativeEnum(Status, {
      required_error: 'Status is required',
    }),
  }),
});

export const deleteDoctorSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((_id) => mongoose.Types.ObjectId.isValid(_id), 'Invalid Id'),
  }),
});

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
