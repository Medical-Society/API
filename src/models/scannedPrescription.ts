import {
  prop,
  getModelForClass,
  modelOptions,
  Ref,
  index,
  Severity,
} from '@typegoose/typegoose';
import { Patient } from './patient';
import { Medicine } from './medicine';

@index({ diseases: 'text', diagnose: 'text', medicines: 'text' })
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

  @prop({})
  birthdate: Date;

  @prop({ allowMixed: Severity.ALLOW, required: true })
  medicines: Medicine[];
}
const ScannedPrescriptionModel = getModelForClass(ScannedPrescription);
export default ScannedPrescriptionModel;
