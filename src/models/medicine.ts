import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Medicine {
  @prop({ required: true, trim: true })
  name: string;

  @prop({ required: true, trim: true })
  time: string;

  @prop({ trim: true })
  note: string;
}
const MedicineModel = getModelForClass(Medicine);
export default MedicineModel;
