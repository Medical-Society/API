import { object, string, TypeOf, nativeEnum,z} from 'zod';
import { Gender } from '../models/patient';
import mongoose from 'mongoose';

export const getAllPatientSchema = object({
  query: object({
    page: string().optional(),
    limit: string().optional(),
  }),
});

export const getPatientSchema = object({
  params: object({
    id: string().refine(
      (_id) => mongoose.Types.ObjectId.isValid(_id),
      'Invalid id',
    ),
  }),
});

export const deletePatientSchema = object({
  params: object({
    id: string().refine(
      (_id) => mongoose.Types.ObjectId.isValid(_id),
      'Invalid id',
    ),
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

    birthdate: string({
      required_error: 'Birthdate is required',
    })
    // .datetime({ message: 'Invalid Date Time must be ISO' }),
    ,
    gender: nativeEnum(Gender, { required_error: 'Gender is required' }),

    address: string({ required_error: 'Address is required' }).optional(),

    phoneNumber: string({ required_error: 'Mobile is required' }).regex(
      /^01(0|1|2|5)[0-9]{8}$/,
    ),
  }),
});

export const loginPatientSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(),
    password: string({ required_error: 'Password is required' }),
  }),
});

export const verifyEmailPatientSchema = object({
  params: object({
    token: string({ required_error: 'Token is required' }),
  }),
});

export const updatePatientSchema = object({
  body: object({
    auth: object({
      id: string().refine(
        (_id) => mongoose.Types.ObjectId.isValid(_id),
        'Invalid id',
      ),
    }),
    patientName: string().optional(),
    address: string().optional(),
    phoneNumber: string()
      .regex(/^01(0|1|2|5)[0-9]{8}$/)
      .optional(),
  }),
});

export const resetPasswordPatientSchema = object({
  body: object({
    token: string({ required_error: 'Token is required' }),
    password: string({ required_error: 'New Password is required' }).min(6),
  }),
});

export const forgotPasswordPatientSchema = object({
  body: object({
    email: string({ required_error: 'Email is required' }).email(),
  }),
});

export const changePasswordPatientSchema = object({
  body: object({
    auth: object({
      id: string().refine(
        (_id) => mongoose.Types.ObjectId.isValid(_id),
        'Invalid id',
      ),
    }),
    oldPassword: string({ required_error: 'Old Password is required' }),
    newPassword: string({ required_error: 'Token is required' }).min(
      6,
      'password is too short -should be min 6 chars',
    ),
  }),
});

export const deleteMyAccountPatientSchema = object({
  body: object({
    auth: object({
      id: string().refine(
        (_id) => mongoose.Types.ObjectId.isValid(_id),
        'Invalid id',
      ),
    }),
  }),
});

export type getAllPatientInput = TypeOf<typeof getAllPatientSchema>['query'];
export type getPatientInput = TypeOf<typeof getPatientSchema>['params'];
export type deletePatientInput = TypeOf<typeof deletePatientSchema>['params'];
export type signupPatientInput = TypeOf<typeof signupPatientSchema>['body'];
export type loginPatientInput = z.infer<typeof loginPatientSchema>['body'];
export type verifyEmailPatientInput = TypeOf<
  typeof verifyEmailPatientSchema
>['params'];
export type updatePatientInput = TypeOf<typeof updatePatientSchema>['body'];
export type resetPasswordPatientInput = TypeOf<
  typeof resetPasswordPatientSchema
>['body'];
export type forgotPasswordPatientInput = TypeOf<
  typeof forgotPasswordPatientSchema
>['body'];
export type changePasswordPatientInput = TypeOf<
  typeof changePasswordPatientSchema
>['body'];
export type deleteMyAccountPatientInput = TypeOf<
  typeof deleteMyAccountPatientSchema
>['body'];
