import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({ schemaOptions: { timestamps: true } })
export class Admin {
  @prop({ required: true })
  name!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true })
  password!: string;
}

const AdminModel = getModelForClass(Admin);
export default AdminModel;
// module.exports = mongoose.model('Admin', adminSchema);
