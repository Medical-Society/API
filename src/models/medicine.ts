import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Medicine {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  time: string;

  @prop()
  note: string;
}
const MedicineModel = getModelForClass(Medicine);
export default MedicineModel;
