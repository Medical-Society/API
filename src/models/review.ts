import {
  Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Patient } from './patient';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Review {
  @prop({ required: true })
  rating!: number;

  @prop()
  comment?: string;

  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;
}

const ReviewModel = getModelForClass(Review);
export default ReviewModel;
