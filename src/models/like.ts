import {
    prop,
    getModelForClass,
    modelOptions,
    Ref,
  } from '@typegoose/typegoose';
  import { Patient } from './patient';
  import { Post } from './post';
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
  })
  export class Like {
  
    @prop({ ref: Patient })
    patient: Ref<Patient>;
  
    @prop({ ref: Post })
    post: Ref<Post>;
  }
  
  const LikeModel = getModelForClass(Like);
  export default LikeModel;
  