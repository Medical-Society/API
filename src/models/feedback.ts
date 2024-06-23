import {
  type Ref,
  getModelForClass,
  modelOptions,
  prop,
} from '@typegoose/typegoose';
import { Doctor } from './doctor';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Feedback {
  @prop({ required: true })
  rating!: number;

  @prop({ required: true })
  comment!: string;

  @prop({ required: true, ref: Doctor })
  doctor: Ref<Doctor>;
}

const FeedbackModel = getModelForClass(Feedback);
export default FeedbackModel;
