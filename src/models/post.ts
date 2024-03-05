import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Post {
  @prop()
  doctorId: string;

  @prop()
  description: string;

  @prop({ type: () => [String] })
  images: string[];
}
const PostModel = getModelForClass(Post);
export default PostModel;
