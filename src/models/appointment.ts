import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Doctor } from './doctor';
import { AppointmentStatus } from './enums';
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Appointment {
  @prop({ ref: Patient })
  patient: Ref<Patient>;

  @prop({ ref: Doctor })
  doctor: Ref<Doctor>;

  @prop({ required: true })
  date: Date;

  @prop({ default: 250 })
  price: number;

  @prop({ default: true })
  paid: boolean;

  @prop({ default: 'PENDING' })
  status: AppointmentStatus;
}

const AppointmentModel = getModelForClass(Appointment);
export default AppointmentModel;
