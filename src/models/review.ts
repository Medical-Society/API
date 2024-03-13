import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Doctor } from './doctor';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review {
  @prop({ required: true })
  rating!: number;

  @prop()
  comment?: string;

  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;

  @prop({ required: true, ref: Doctor })
  doctor: Ref<Doctor>;
}

const ReviewModel = getModelForClass(Review);
export default ReviewModel;
