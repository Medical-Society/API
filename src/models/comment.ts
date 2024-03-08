import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Comment {
  
  @prop()
  text: string;
  
  @prop()
  patientId: string;
  
  @prop()
  postId: string;
}

const CommentModel = getModelForClass(Comment);
export default CommentModel;
