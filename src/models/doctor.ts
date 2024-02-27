import {
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
} from '@typegoose/typegoose';

import bcrypt from 'bcryptjs';
import { Gender, Status } from './enums';

@pre<Doctor>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
})
@index({ email: 1 })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Doctor {
  @prop({ required: true })
  englishFullName!: string;

  @prop({ required: true })
  arabicFullName!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true })
  specialization!: string;

  @prop({ default: 'Not provided' })
  clinicAddress!: string;

  @prop({ required: true })
  nationalID!: string;

  @prop({ required: true })
  phoneNumber!: string;

  @prop({ required: true })
  birthdate!: Date;

  @prop({ required: true })
  gender!: Gender;

  @prop({ required: true, default: Status.PENDING })
  status!: Status;

  @prop({ required: true, default: false })
  isVerified!: boolean;

  @prop()
  about?: string;

  async comparePassword(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

const DoctorModel = getModelForClass(Doctor);
export default DoctorModel;