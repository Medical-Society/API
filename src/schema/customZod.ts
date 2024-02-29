import { z } from 'zod';
import mongoose from 'mongoose';

export const zodObjectId = z
  .string()
  .refine((id) => mongoose.Types.ObjectId.isValid(id), 'Invalid Id');

const dateLike = z.union([z.number(), z.string(), z.date()]);
export const validAgeDate = (age: number) => {
  return dateLike.pipe(z.coerce.date()).refine((date: Date) => {
    let ageDiff = Date.now() - date.getTime();
    let ageDiffDate = new Date(ageDiff);
    let startDate = new Date(0);
    let candidateAge =
      ageDiffDate.getUTCFullYear() - startDate.getUTCFullYear();
    return candidateAge >= age;
  }, 'Age must be greater than ' + age);
};

export const saveImageSchema = z.object({
  body: z
    .object({
      auth: z.object({
        id: zodObjectId,
      }),
      imageURL: z.string({ required_error: 'Image is required' }),
    })
    .strict(),
});

export type SaveImageInput = z.infer<typeof saveImageSchema>['body'];

