import {
  getModelForClass,
  modelOptions,
  prop,
  pre,
} from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

@pre<Admin>('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
})
@modelOptions({ schemaOptions: { timestamps: true } })
export class Admin {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;

  async comparePassword(candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
  }
}

const AdminModel = getModelForClass(Admin);
export default AdminModel;
// module.exports = mongoose.model('Admin', adminSchema);
