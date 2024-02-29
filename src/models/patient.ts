import {
  prop,
  getModelForClass,
  modelOptions,
  pre,
  index,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';
import { Gender } from './enums';

const DEFAULT_IMAGE =
  'https://www.businessnetworks.com/sites/default/files/default_images/default-avatar.png';
@pre<Patient>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Patient {
  @prop({ required: true, trim: true })
  patientName: string;

  @prop({ required: true, unique: true, trim: true, lowercase: true })
  email: string;

  @prop({ required: true, trim: true })
  password: string;

  @prop({ required: true })
  birthdate: Date;

  @prop({ required: true })
  gender: Gender;

  @prop({ required: true })
  address: string;

  @prop({ required: true })
  phoneNumber: string;

  @prop({ default: false })
  isVerified: boolean;

  @prop({ match: /^(http:\/\/|https:\/\/).+/, default: DEFAULT_IMAGE })
  avatar: string;

  async comparePassword(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}
const PatientModel = getModelForClass(Patient);
export default PatientModel;

//🍩
