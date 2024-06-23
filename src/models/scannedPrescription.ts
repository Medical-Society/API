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

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ScannedPrescription {
  @prop({ required: true, ref: Patient })
  patient: Ref<Patient>;

  @prop({ trim: true })
  patientName: string;

  @prop({ trim: true })
  doctorName: string;
  @prop()
  diseases: string;

  @prop()
  diagnose: string;

  @prop({})
  birthdate: Date;

  @prop({ allowMixed: Severity.ALLOW, required: true })
  medicines: Medicine[];
}
const ScannedPrescriptionModel = getModelForClass(ScannedPrescription);
export default ScannedPrescriptionModel;
