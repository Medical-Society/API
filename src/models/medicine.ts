import {
    prop,
    getModelForClass,
    modelOptions,
    Ref,
  } from '@typegoose/typegoose';
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
  })
  export class Medicine {
    @prop({required: true})
    medicineName: string;
  
    @prop({required: true})
    numberOfTimesPerDay: number;
  
    @prop({required: true})
    prescriptionId: string;    
  }
  const MedicineModel = getModelForClass(Medicine);
  export default MedicineModel;
  