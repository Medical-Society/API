import { z } from 'zod';
import mongoose from 'mongoose';

export const zodObjectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid Id');

const dateLike = z.union([z.number(), z.string(), z.date()], {
  errorMap: (_) => {
    return { message: 'birthdate is required' };
  },
});

export const validAgeDate = (age: number) => {
  return dateLike.pipe(z.coerce.date()).refine((date: Date) => {
    const candidateAge = date.getFullYear() - new Date().getFullYear();
    return candidateAge >= age;
  }, 'Age must be greater than ' + age);
};

export const paginationQuery = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').optional(),
  // .default(1),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(50)
    .optional(),
  // .default(10),
});
