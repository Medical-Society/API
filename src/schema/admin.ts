import { z } from 'zod';

// Schemas
export const signupAdminSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'English Full Name is required',
    }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid Email')
      .transform((value) => value.toLowerCase()),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Invalid Password , must be at least 8 characters'),
  }),
});

export const loginAdminSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email()
      .transform((value) => value.toLowerCase()),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

// Types
export type SignupAdminInput = z.infer<typeof signupAdminSchema>['body'];
export type LoginAdminInput = z.infer<typeof loginAdminSchema>['body'];
