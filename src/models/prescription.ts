import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
  index,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Medicine } from './medicine';
import { Doctor } from './doctor';

@index({ diseases: 'text', diagnose: 'text', medicines: 'text' })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Prescription {
  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;

  @prop({ required: true, ref: Doctor })
  doctor: Ref<Doctor>;

  @prop()
  diseases: string;

  @prop()
  diagnose: string;

  @prop({ required: true })
  medicines: Medicine[];
}
const PrescriptionModel = getModelForClass(Prescription);
export default PrescriptionModel;
