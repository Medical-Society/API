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
    }).datetime({ message: 'Invalid Date Time must be ISO' }),
    
    gender: nativeEnum(Gender, { required_error: 'Gender is required' }),

    address: string({ required_error: 'Address is required' }).optional(),

    phoneNumber: string({ required_error: 'Mobile is required' }).regex(
      /^01(0|1|2|5)[0-9]{8}$/,
    ),
  }).strict()
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
  }).strict(),
});

export const deleteMyAccountPatientSchema = object({
  body:object({
    auth: object({
      id: string().refine(
        (_id) => mongoose.Types.ObjectId.isValid(_id),
        'Invalid id',
      ),
    }),
})
});

// export const deleteMyAccountPatientSchema = object({
//   headers: object({
//     authorization: string()
//   }) // Allow additional headers in the request

// });
export type getAllPatientInput = z.infer<typeof getAllPatientSchema>['query'];
export type getPatientInput = z.infer<typeof getPatientSchema>['params'];
export type deletePatientInput = z.infer<typeof deletePatientSchema>['params'];
export type signupPatientInput = z.infer<typeof signupPatientSchema>['body'];
export type loginPatientInput = z.infer<typeof loginPatientSchema>['body'];
export type verifyEmailPatientInput = z.infer<
  typeof verifyEmailPatientSchema
>['params'];
export type updatePatientInput = z.infer<typeof updatePatientSchema>['body'];
export type resetPasswordPatientInput = z.infer<
  typeof resetPasswordPatientSchema
>['body'];
export type forgotPasswordPatientInput = z.infer<
  typeof forgotPasswordPatientSchema
>['body'];
export type changePasswordPatientInput = z.infer<
  typeof changePasswordPatientSchema
>['body'];
export type deleteMyAccountPatientInput = z.infer<
  typeof deleteMyAccountPatientSchema
>['body'];

