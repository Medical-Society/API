import {
  prop,
  getModelForClass,
  modelOptions,
  pre,
  index,
} from '@typegoose/typegoose';
import argon2 from 'argon2';
import bcrypt from 'bcryptjs';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@pre<Patient>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  }
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

  async comparePassword(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}
const PatientModel = getModelForClass(Patient);
export default PatientModel;

//model in service
// schema and service in controller
//schema and controller in router
//🍩// model
//🍩 schema
//🍩 router
//services
// controller
//🍩middleware
