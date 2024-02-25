import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  pre,
  DocumentType,
  index,
} from '@typegoose/typegoose';
import argon2 from 'argon2';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

@pre<Patient>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
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

  async validatePassword(
    this: DocumentType<Patient>,
    candidatePassword: string,
  ) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      console.log(e, 'can not validate password');
      return false;
    }
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
