import { object, string, TypeOf, nativeEnum, z } from 'zod';
import { Gender } from '../models/enums';
import { zodObjectId, validAgeDate } from './customZod';

export const getAllPatientSchema = object({
  query: object({
    page: string().optional(),
    limit: string().optional(),
  }),
});

export const getPatientSchema = object({
  params: object({
    id: zodObjectId,
  }),
});

export const deletePatientSchema = object({
  params: object({
    id: zodObjectId,
  }),
});

export const signupPatientSchema = object({
  body: object({
    patientName: string({
      required_error: 'Patient Name is required',
    }),
    email: string({
      required_error: 'Email is required',
    }).email('Not a valid email'),

    password: string({
      required_error: 'Password is required',
    }).min(6, 'password is too short -should be min 6 chars'),

    birthdate: validAgeDate(0),

    gender: nativeEnum(Gender, { required_error: 'Gender is required' }),

    address: string({ required_error: 'Address is required' }).optional(),

    phoneNumber: string({ required_error: 'Mobile is required' }).regex(
      /^01(0|1|2|5)[0-9]{8}$/,
    ),
  }).strict(),
});

export const loginPatientSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(),
    password: string({ required_error: 'Password is required' }),
  }).strict(),
});

export const verifyEmailPatientSchema = object({
  params: object({
    token: string({ required_error: 'Token is required' }),
  }),
});

export const updatePatientSchema = object({
  body: object({
    auth: object({
      id: zodObjectId,
    }),
    patientName: string().optional(),
    address: string().optional(),
    phoneNumber: string()
      .regex(/^01(0|1|2|5)[0-9]{8}$/)
      .optional(),
  }).strict(),
});

export const resetPasswordPatientSchema = object({
  body: object({
    token: string({ required_error: 'Token is required' }),
    password: string({ required_error: 'New Password is required' }).min(6),
  }).strict(),
});

export const forgotPasswordPatientSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(),
  }).strict(),
});

export const changePasswordPatientSchema = object({
  body: object({
    auth: object({
      id: zodObjectId,
    }),
    oldPassword: string({ required_error: 'Old Password is required' }),
    newPassword: string({ required_error: 'Token is required' }).min(
      6,
      'password is too short -should be min 6 chars',
    ),
  }).strict(),
});

export const deleteMyAccountPatientSchema = object({
  body: object({
    auth: object({
      id: zodObjectId,
    }),
  }),
});

export const savePatientImageSchema = object({
  body: object({
    auth: object({
      id: zodObjectId,
    }),
    imageURL: string({ required_error: 'Image is required' }),
  }).strict(),
});

export type GetAllPatientInput = z.infer<typeof getAllPatientSchema>['query'];
export type GetPatientInput = z.infer<typeof getPatientSchema>['params'];
export type DeletePatientInput = z.infer<typeof deletePatientSchema>['params'];
export type SignupPatientInput = z.infer<typeof signupPatientSchema>['body'];
export type LoginPatientInput = z.infer<typeof loginPatientSchema>['body'];
export type VerifyEmailPatientInput = z.infer<
  typeof verifyEmailPatientSchema
>['params'];
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>['body'];
export type ResetPasswordPatientInput = z.infer<
  typeof resetPasswordPatientSchema
>['body'];
export type ForgotPasswordPatientInput = z.infer<
  typeof forgotPasswordPatientSchema
>['body'];
export type ChangePasswordPatientInput = z.infer<
  typeof changePasswordPatientSchema
>['body'];
export type DeleteMyAccountPatientInput = z.infer<
  typeof deleteMyAccountPatientSchema
>['body'];
export type SaveImagePatientInput = z.infer<
  typeof savePatientImageSchema
>['body'];
