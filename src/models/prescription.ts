import {
  prop,
  getModelForClass,
  modelOptions,
  type Ref,
  index,
  Severity,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Medicine } from './medicine';
import { Doctor } from './doctor';

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

  @prop({ allowMixed: Severity.ALLOW, required: true })
  medicines: Medicine[];
}
const PrescriptionModel = getModelForClass(Prescription);
export default PrescriptionModel;
