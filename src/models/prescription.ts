import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import {Medicine} from './medicine'
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Prescription {
  @prop()
  patientName: string;

  @prop()
  doctorName: string;

  @prop()
  date: Date;

  @prop()
  diseases: string;

  @prop()
  diagnose: string;

  @prop({ required: true })
  medicines:Medicine[];

  @prop()
  notes: string;

  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;
}
const PrescriptionModel = getModelForClass(Prescription);
export default PrescriptionModel;
